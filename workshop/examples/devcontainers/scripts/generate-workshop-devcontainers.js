#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const tutorialBaseUrl = "https://github.github.com/gh-aw/workshop/";
const hashFormat = "#j=<journeyId>&s=<scenarioId>&t=<stepKey>";
const startupCommandId = "simpleBrowser.show";
const devcontainerImage = "mcr.microsoft.com/devcontainers/base:ubuntu-24.04";
const githubCliFeatureRef = "ghcr.io/devcontainers/features/github-cli:1";
const nodeFeatureRef = "ghcr.io/devcontainers/features/node:1";
const postCreateCommand = "bash -lc 'gh extension install github/gh-copilot --force && npm install -g @github/copilot@latest'";
const workflowFileByScenario = {
  foundation: ".github/workflows/daily-report-status.md",
  "daily-status": ".github/workflows/daily-status.md",
  "daily-docs": ".github/workflows/daily-docs.md",
  "pr-reviewer": ".github/workflows/pr-code-reviewer.md"
};

const workshopDir = path.resolve(__dirname, "../../../");
const devcontainersDir = path.resolve(__dirname, "..");
const profilesDir = path.join(devcontainersDir, "profiles");
const profileMapPath = path.join(devcontainersDir, "profile-map.json");

const journeyDefinitions = {
  "codespaces-terminal": {
    label: "codespaces terminal",
    setupKey: "02a-setup-codespace",
    repoCreateKey: "03a-create-your-repo-terminal",
    installKey: "06a-install-terminal",
    firstWorkflowPrefix: "07a-",
    includeModelAccess: true,
    includeRunStep: true,
    buildVariant: "terminal",
    optionalStarterId: "actions-write"
  },
  "local-terminal": {
    label: "local terminal",
    setupKey: "02b-setup-local",
    repoCreateKey: "03a-create-your-repo-terminal",
    installKey: "06b-install-local",
    firstWorkflowPrefix: "07a-",
    includeModelAccess: true,
    includeRunStep: true,
    buildVariant: "terminal"
  },
  "github-ui": {
    label: "GitHub UI",
    repoCreateKey: "03b-create-your-repo-ui",
    installKey: "06c-install-ui",
    firstWorkflowPrefix: "07b-",
    includeModelAccess: true,
    includeRunStep: true,
    buildVariant: "ui"
  },
  "copilot-agent": {
    label: "Copilot agent",
    repoCreateKey: "03b-create-your-repo-ui",
    firstWorkflowPrefix: "07c-",
    includeModelAccess: true,
    includeRunStep: true,
    scenarioEntryKey: "10-choose-your-scenario",
    buildKey: "11d-build-copilot-agents",
    buildFollowUpKey: "11d2-review-and-merge"
  }
};

function toStem(fileName) {
  return fileName.replace(/\.md$/i, "");
}

function listWorkshopStepFiles() {
  const readmePath = path.join(workshopDir, "README.md");
  const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
  const fileEntries = fs
    .readdirSync(workshopDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        !entry.name.startsWith("side-quest") &&
        entry.name !== "README.md"
    )
    .map((entry) => ({
      file: entry.name,
      stepKey: toStem(entry.name)
    }));

  const defaultOrder = [...fileEntries].sort((left, right) => collator.compare(left.file, right.file));
  if (!fs.existsSync(readmePath)) {
    return defaultOrder;
  }

  const filesByName = new Map(fileEntries.map((entry) => [entry.file, entry]));
  const orderedFromReadme = [];
  const seen = new Set();
  const readme = fs.readFileSync(readmePath, "utf8");
  const curriculumSection = readme.split("## Optional Side Quests")[0] || readme;
  const linkPattern = /\]\(([^)]+\.md)\)/g;
  let match;
  while ((match = linkPattern.exec(curriculumSection)) !== null) {
    const fileName = match[1];
    const entry = filesByName.get(fileName);
    if (entry && !seen.has(fileName)) {
      orderedFromReadme.push(entry);
      seen.add(fileName);
    }
  }

  const remaining = defaultOrder.filter((entry) => !seen.has(entry.file));
  return [...orderedFromReadme, ...remaining];
}

function indexSteps(stepEntries) {
  const byKey = new Map();
  for (const entry of stepEntries) {
    byKey.set(entry.stepKey, entry);
  }
  return byKey;
}

function ensureStepExists(stepByKey, stepKey) {
  if (!stepByKey.has(stepKey)) {
    throw new Error(`Workshop step '${stepKey}.md' does not exist under ${workshopDir}`);
  }
}

function maybeAddStep(stepKeys, stepByKey, stepKey) {
  if (stepKey && stepByKey.has(stepKey)) {
    stepKeys.push(stepKey);
  }
}

function addMatchingSteps(stepKeys, stepEntries, predicate) {
  for (const entry of stepEntries) {
    if (predicate(entry.stepKey)) {
      stepKeys.push(entry.stepKey);
    }
  }
}

function stepOrderIndex(stepEntries) {
  return new Map(stepEntries.map((entry, index) => [entry.stepKey, index]));
}

function uniqueStepKeys(stepKeys, orderIndex) {
  return [...new Set(stepKeys)].sort((left, right) => (orderIndex.get(left) ?? Number.MAX_SAFE_INTEGER) - (orderIndex.get(right) ?? Number.MAX_SAFE_INTEGER));
}

function discoverScenarioDefinitions(stepByKey) {
  const scenarios = {
    foundation: {
      workflowFile: workflowFileByScenario.foundation
    }
  };

  for (const stepKey of stepByKey.keys()) {
    const match = /^10([a-z])-design-(.+)$/.exec(stepKey);
    if (!match) {
      continue;
    }
    const [, trackId, slug] = match;
    scenarios[slug] = {
      trackId,
      designKey: stepKey,
      workflowFile: workflowFileByScenario[slug] || null
    };
  }

  return scenarios;
}

function buildFoundationStepKeys(journey, stepEntries, stepByKey, orderIndex) {
  const stepKeys = [];
  maybeAddStep(stepKeys, stepByKey, journey.setupKey);
  maybeAddStep(stepKeys, stepByKey, journey.repoCreateKey);
  maybeAddStep(stepKeys, stepByKey, journey.installKey);
  addMatchingSteps(stepKeys, stepEntries, (stepKey) => stepKey.startsWith(journey.firstWorkflowPrefix));
  if (journey.includeModelAccess) {
    maybeAddStep(stepKeys, stepByKey, "07d-confirm-model-access");
  }
  if (journey.includeRunStep) {
    maybeAddStep(stepKeys, stepByKey, "08-run-your-workflow");
  }
  return uniqueStepKeys(stepKeys, orderIndex);
}

function buildScenarioStepKeys(journeyId, journey, scenario, stepEntries, stepByKey, orderIndex) {
  const stepKeys = [];

  if (journeyId === "copilot-agent") {
    maybeAddStep(stepKeys, stepByKey, journey.scenarioEntryKey);
    maybeAddStep(stepKeys, stepByKey, journey.buildKey);
    maybeAddStep(stepKeys, stepByKey, journey.buildFollowUpKey);
    maybeAddStep(stepKeys, stepByKey, "12-test-and-iterate");
    return uniqueStepKeys(stepKeys, orderIndex);
  }

  maybeAddStep(stepKeys, stepByKey, scenario.designKey);

  const buildPrefix = `11${scenario.trackId}`;
  const scenarioSlug = scenario.designKey.replace(/^10[a-z]-design-/, "");
  maybeAddStep(stepKeys, stepByKey, `${buildPrefix}-build-${scenarioSlug}`);
  addMatchingSteps(
    stepKeys,
    stepEntries,
    (stepKey) =>
      stepKey.startsWith(buildPrefix) &&
      stepKey.includes(scenarioSlug) &&
      stepKey.endsWith(`-${journey.buildVariant}`)
  );

  maybeAddStep(stepKeys, stepByKey, "12-test-and-iterate");

  if (scenario.designKey === "10a-design-daily-status") {
    maybeAddStep(stepKeys, stepByKey, journey.buildVariant === "terminal" ? "13a-schedule-it-terminal" : "13b-schedule-it-ui");
  }

  return uniqueStepKeys(stepKeys, orderIndex);
}

function launchUrlFor(journeyId, scenarioId, stepKey) {
  return `${tutorialBaseUrl}#j=${journeyId}&s=${scenarioId}&t=${stepKey}`;
}

function shellSingleQuoted(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`;
}

function postAttachCommandFor(launchUrl) {
  return `bash -lc "printf '\\nWorkshop URL: %s\\n\\n' \"\\$1\"; gh --version; node --version" -- ${shellSingleQuoted(launchUrl)}`;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function removeStaleProfileDirs(validProfileIds) {
  if (!fs.existsSync(profilesDir)) {
    return;
  }
  for (const entry of fs.readdirSync(profilesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    if (!validProfileIds.has(entry.name)) {
      fs.rmSync(path.join(profilesDir, entry.name), { recursive: true, force: true });
    }
  }
}

function buildProfile(profileId, journeyId, scenarioId, workflowFile, stepKeys, optionalStarterId) {
  const journey = journeyDefinitions[journeyId];
  const firstStep = stepKeys[0];
  const launchUrl = launchUrlFor(journeyId, scenarioId, firstStep);
  const settings = {
    "gh-aw-workshop.profileVersion": 1,
    "gh-aw-workshop.generatedBy": "workshop/examples/devcontainers/scripts/generate-workshop-devcontainers.js",
    "gh-aw-workshop.profileId": profileId,
    "gh-aw-workshop.tutorialBaseUrl": tutorialBaseUrl,
    "gh-aw-workshop.hashFormat": hashFormat,
    "gh-aw-workshop.startupCommandId": startupCommandId,
    "gh-aw-workshop.launchUrl": launchUrl,
    "gh-aw-workshop.journeyId": journeyId,
    "gh-aw-workshop.scenarioId": scenarioId,
    "gh-aw-workshop.workflowFile": workflowFile,
    "gh-aw-workshop.stepKeys": stepKeys
  };

  const devcontainer = {
    name: `gh-aw workshop: ${journey.label} / ${scenarioId}`,
    image: devcontainerImage,
    features: {
      [githubCliFeatureRef]: {},
      [nodeFeatureRef]: {
        version: "lts"
      }
    },
    customizations: {
      vscode: {
        extensions: ["GitHub.copilot", "GitHub.copilot-chat"],
        settings
      }
    },
    postCreateCommand,
    postAttachCommand: postAttachCommandFor(launchUrl)
  };

  const profile = {
    id: profileId,
    journeyId,
    scenarioId,
    devcontainerPath: `profiles/${profileId}/.devcontainer/devcontainer.json`,
    workflowFile,
    stepFiles: stepKeys.map((stepKey) => `${stepKey}.md`),
    stepKeyHints: stepKeys
  };

  if (optionalStarterId) {
    profile.optionalStarterId = optionalStarterId;
  }

  return { profile, devcontainer };
}

function main() {
  const workshopSteps = listWorkshopStepFiles();
  const workshopStepByKey = indexSteps(workshopSteps);
  const workshopStepOrder = stepOrderIndex(workshopSteps);
  const scenarioDefinitions = discoverScenarioDefinitions(workshopStepByKey);
  const profiles = [];
  const validProfileIds = new Set();

  for (const [scenarioId, scenario] of Object.entries(scenarioDefinitions)) {
    for (const journeyId of Object.keys(journeyDefinitions)) {
      const journey = journeyDefinitions[journeyId];
      const stepKeys =
        scenarioId === "foundation"
          ? buildFoundationStepKeys(journey, workshopSteps, workshopStepByKey, workshopStepOrder)
          : buildScenarioStepKeys(journeyId, journey, scenario, workshopSteps, workshopStepByKey, workshopStepOrder);

      if (stepKeys.length === 0) {
        continue;
      }

      stepKeys.forEach((stepKey) => ensureStepExists(workshopStepByKey, stepKey));
      const profileId = `${journeyId}__${scenarioId}`;
      validProfileIds.add(profileId);
      const { profile, devcontainer } = buildProfile(
        profileId,
        journeyId,
        scenarioId,
        scenario.workflowFile,
        stepKeys,
        journey.optionalStarterId
      );
      profiles.push(profile);
      writeJson(path.join(profilesDir, profileId, ".devcontainer", "devcontainer.json"), devcontainer);
    }
  }

  removeStaleProfileDirs(validProfileIds);

  writeJson(profileMapPath, {
    version: 1,
    generatedBy: "workshop/examples/devcontainers/scripts/generate-workshop-devcontainers.js",
    tutorialBaseUrl,
    hashFormat,
    startupCommandId,
    schema: {
      tutorialBaseUrl: "Hosted workshop entry page for browser-based routing",
      hashFormat: "URL hash contract used by the tutorial browser state",
      startupCommandId:
        "VS Code command palette command that should open the hosted workshop inside the integrated browser",
      journeyId: "Tutorial path identifier used by the workshop browser state",
      scenarioId: "Scenario identifier used by the workshop browser state",
      stepKeyHints: "Workshop step keys stored in the URL hash `t` parameter that should resolve to this profile",
      devcontainerPath: "Relative path to the self-contained profile folder"
    },
    profiles
  });

  process.stdout.write(`Generated ${profiles.length} workshop devcontainer profiles.\n`);
}

main();