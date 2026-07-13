"use strict";

const DAY_MS = 24 * 60 * 60 * 1000;
const RUN_INDEX_SEED_FACTOR = 31;
const fs = require("node:fs");
const path = require("node:path");

const VALID_TERMINALS = {
  macos: new Set(["bash", "zsh"]),
  linux: new Set(["bash", "zsh"]),
  windows: new Set(["powershell", "cmd"])
};

const PROVIDER_SECRET_BY_NAME = {
  github: "COPILOT_GITHUB_TOKEN",
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY"
};
const INFERENCE_PROVIDERS = Object.keys(PROVIDER_SECRET_BY_NAME);
const INFERENCE_PROVIDER_SEED_OFFSET = 4;
const COPILOT_SECRET_PRIMARY_MODULO = 5;
const COPILOT_SECRET_SECONDARY_MODULO = 7;
const THIRD_PARTY_SECRET_BEGINNER_MODULO = 3;
const THIRD_PARTY_SECRET_SECONDARY_MODULO = 8;
const ANTHROPIC_MISSING_REMAINDER = 0;
const OPENAI_MISSING_REMAINDER = 1;
const COPILOT_PERMISSION_GITHUB_MODULO = 4;
const COPILOT_PERMISSION_OTHER_MODULO = 3;
const WORD_COUNT_COMPLEXITY_THRESHOLD = 1400;
const COMMAND_LINE_COMPLEXITY_THRESHOLD = 18;
const CALLOUT_COMPLEXITY_THRESHOLD = 18;
const OPTIONAL_PATH_COMPLEXITY_THRESHOLD = 10;
const COMMAND_BLOCK_TERMINAL_WEIGHT = 0.18;
const COMMAND_LINE_TERMINAL_WEIGHT = 0.03;
const TERMINAL_DEMAND_CAP = 0.95;
const UI_ALTERNATIVE_TERMINAL_DISCOUNT = 0.1;
const UI_ALTERNATIVE_TERMINAL_DISCOUNT_CAP = 0.3;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function stableHash(value) {
  const input = String(value || "");
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function toDayOfYear(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  return Math.floor((date - start) / DAY_MS);
}

function deterministicChoice(seed, choices) {
  const index = Math.abs(seed) % choices.length;
  return choices[index];
}

function hasThirdPartyProviderSecret(level, seed, missingRemainder) {
  if (level !== "beginner") {
    return true;
  }
  return seed % THIRD_PARTY_SECRET_BEGINNER_MODULO !== missingRemainder;
}

function deepFreeze(obj) {
  if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.values(obj).forEach((value) => deepFreeze(value));
  }
  return obj;
}

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function countMatches(text, pattern) {
  const matches = String(text || "").match(pattern);
  return matches ? matches.length : 0;
}

function analyzeStepMarkdown(stepId, markdown, files = []) {
  const text = String(markdown || "");
  const lines = text.split(/\r?\n/);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const headingCount = countMatches(text, /^#{1,6}\s+/gm);
  const calloutCount = countMatches(text, /^>\s+\[![A-Z]+\]/gm);
  const clickCueCount = countMatches(
    text,
    /\b(click|open|navigate|Actions tab|browser|GitHub UI|web UI)\b/gi
  );
  const authCueCount = countMatches(
    text,
    /\b(auth|login|signed in|token|Copilot|permissions?|403|secret)\b/gi
  );
  const enterpriseCueCount = countMatches(text, /\b(GHES|GHEC|EMU|enterprise|org admin)\b/gi);
  const troubleshootingCueCount = countMatches(
    text,
    /\b(troubleshoot|error|failed|warning|blocked|if you see|if you get|fix)\b/gi
  );
  const optionalPathCueCount = countMatches(
    text,
    /\b(Adventure [A-Z]|Path [A-Z]|alternative|optional|UI path|browser path|Codespace|local path)\b/gi
  );
  const codeBlocks = [];
  for (let i = 0; i < lines.length; i += 1) {
    const start = lines[i].match(/^```([A-Za-z0-9_-]+)?\s*$/);
    if (!start) continue;
    const language = String(start[1] || "").toLowerCase();
    const blockLines = [];
    i += 1;
    while (i < lines.length && !/^```/.test(lines[i])) {
      blockLines.push(lines[i]);
      i += 1;
    }
    codeBlocks.push({ language, lines: blockLines });
  }
  const commandBlockCount = codeBlocks.filter((block) =>
    ["bash", "sh", "shell", "zsh", "powershell", "pwsh", ""].includes(block.language)
  ).length;
  const commandLineCount = codeBlocks.reduce(
    (sum, block) =>
      sum +
      block.lines.filter((line) => /\b(gh|git|mkdir|cd|touch|printf|curl|brew|winget|sudo)\b/.test(line))
        .length,
    0
  );
  const uiAlternativeCount = countMatches(text, /\b(UI alternative|GitHub UI path|browser path|Path C)\b/gi);
  const complexity = clamp(
    0.12 +
      Math.min(wordCount / WORD_COUNT_COMPLEXITY_THRESHOLD, 0.32) +
      Math.min(commandLineCount / COMMAND_LINE_COMPLEXITY_THRESHOLD, 0.24) +
      Math.min(calloutCount / CALLOUT_COMPLEXITY_THRESHOLD, 0.12) +
      Math.min(optionalPathCueCount / OPTIONAL_PATH_COMPLEXITY_THRESHOLD, 0.2),
    0.05,
    0.95
  );
  const terminalDemand = clamp(
    Math.min(
      commandBlockCount * COMMAND_BLOCK_TERMINAL_WEIGHT +
        commandLineCount * COMMAND_LINE_TERMINAL_WEIGHT,
      TERMINAL_DEMAND_CAP
    ) -
      Math.min(
        uiAlternativeCount * UI_ALTERNATIVE_TERMINAL_DISCOUNT,
        UI_ALTERNATIVE_TERMINAL_DISCOUNT_CAP
      ),
    0,
    1
  );
  const browserSupport = clamp(
    Math.min((clickCueCount + uiAlternativeCount * 2 + optionalPathCueCount) * 0.06, 1),
    0,
    1
  );
  const authDemand = clamp(Math.min(authCueCount * 0.07, 1), 0, 1);
  const enterpriseDemand = clamp(Math.min(enterpriseCueCount * 0.12, 1), 0, 1);
  const troubleshootingSupport = clamp(
    Math.min((troubleshootingCueCount + calloutCount) * 0.06, 1),
    0,
    1
  );
  const conceptDemand = clamp(
    0.08 + Math.min((headingCount + optionalPathCueCount + calloutCount) * 0.03, 0.6),
    0,
    1
  );

  return deepFreeze({
    stepId,
    files,
    wordCount,
    headingCount,
    calloutCount,
    commandBlockCount,
    commandLineCount,
    clickCueCount,
    uiAlternativeCount,
    authDemand,
    browserSupport,
    complexity,
    conceptDemand,
    enterpriseDemand,
    terminalDemand,
    troubleshootingSupport,
    contentHash: stableHash(text)
  });
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeNumericField(container, fieldName, stepId) {
  if (container[fieldName] == null) {
    return;
  }
  if (!Number.isFinite(Number(container[fieldName]))) {
    console.warn(`[simulator] Agent insight '${stepId}.${fieldName}' should be numeric.`);
    delete container[fieldName];
    return;
  }
  container[fieldName] = Number(container[fieldName]);
}

function normalizeNumericObject(container, fieldName, stepId) {
  if (container[fieldName] == null) {
    return;
  }
  if (!isPlainObject(container[fieldName])) {
    console.warn(`[simulator] Agent insight '${stepId}.${fieldName}' should be an object.`);
    delete container[fieldName];
    return;
  }
  for (const key of Object.keys(container[fieldName])) {
    normalizeNumericField(container[fieldName], key, `${stepId}.${fieldName}`);
  }
}

function normalizeAgentInsightsByStep(input) {
  if (!isPlainObject(input)) {
    return {};
  }
  const raw = input.stepInsightsById;
  if (!isPlainObject(raw)) {
    return {};
  }
  const normalized = {};
  for (const [stepId, insight] of Object.entries(raw)) {
    if (!isPlainObject(insight)) {
      console.warn(`[simulator] Ignoring malformed agent insight for step '${stepId}': expected an object.`);
      continue;
    }
    const nextInsight = { ...insight };
    if (nextInsight.summary != null && typeof nextInsight.summary !== "string") {
      console.warn(`[simulator] Agent insight '${stepId}.summary' should be a string.`);
      delete nextInsight.summary;
    }
    normalizeNumericField(nextInsight, "bias", stepId);
    normalizeNumericObject(nextInsight, "signalAdjustments", stepId);
    normalizeNumericObject(nextInsight, "pathAdjustments", stepId);
    if (nextInsight.riskTags != null && !Array.isArray(nextInsight.riskTags)) {
      console.warn(`[simulator] Agent insight '${stepId}.riskTags' should be an array.`);
      delete nextInsight.riskTags;
    }
    normalized[stepId] = nextInsight;
  }
  return normalized;
}

function buildStepContentById({
  steps = [],
  curriculum,
  stepFilesById = {},
  repoRoot = process.cwd(),
  agentInsightsByStep = {}
}) {
  const workshopDir = path.resolve(repoRoot, "workshop");
  const curriculumEntries = Array.isArray(curriculum?.main_steps) ? curriculum.main_steps : [];
  const curriculumByFile = new Map(curriculumEntries.map((entry) => [entry.file, entry]));
  const stepContentById = {};

  for (const stepId of steps) {
    const mappedFiles = stepFilesById[stepId];
    const candidateFiles = Array.isArray(mappedFiles)
      ? mappedFiles
      : mappedFiles
      ? [mappedFiles]
      : curriculumEntries
          .filter((entry) => entry.file.replace(/\.md$/i, "") === stepId)
          .map((entry) => entry.file);
    const existingFiles = candidateFiles.filter((file) => fs.existsSync(path.resolve(workshopDir, file)));
    const markdown = existingFiles
      .map((file) => fs.readFileSync(path.resolve(workshopDir, file), "utf8"))
      .join("\n\n");
    stepContentById[stepId] = deepFreeze({
      ...analyzeStepMarkdown(
        stepId,
        markdown,
        existingFiles.map((file) => ({
          file,
          title: curriculumByFile.get(file)?.title || file.replace(/\.md$/i, "")
        }))
      ),
      agentInsight: agentInsightsByStep[stepId] || null
    });
  }

  return deepFreeze(stepContentById);
}

function defaultEnvironmentForStudent(student, dayOfYear, runIndex = 0) {
  const id = Number(student.id || 0);
  const seed = id * 97 + dayOfYear * 17 + runIndex * RUN_INDEX_SEED_FACTOR;
  const background = String(student.background || "");
  const level = String(student.level || "");
  const tool = String(student.tool || "cli");
  const uiPreferred = Boolean(student.ui_preferred);
  const priorRuns = Number(student.runs || 0);
  const priorSuccesses = Number(student.successes || 0);
  const priorSuccessRate = priorRuns > 0 ? priorSuccesses / priorRuns : 0;

  const isEnterprise = background === "enterprise-dev" || background === "enterprise-devops";
  const deployment = isEnterprise
    ? deterministicChoice(seed + 1, ["ghec", "ghes"])
    : "github.com";
  const accountType = isEnterprise ? "enterprise-managed" : "personal";

  const os = deterministicChoice(seed + 2, ["macos", "linux", "windows"]);
  const terminal = deterministicChoice(seed + 3, Array.from(VALID_TERMINALS[os]));

  const inCodespaces =
    tool === "mobile"
      ? false
      : tool === "CCA"
      ? seed % 10 < 4
      : tool === "vscode"
      ? seed % 10 < 6
      : seed % 10 < 2;
  const hasGh = tool === "mobile" ? false : level !== "beginner" || inCodespaces || seed % 3 !== 0;
  const hasAw = false;
  const tokenScope = inCodespaces && isEnterprise ? "org" : "user";
  const hasGithubSession = tool === "mobile" || seed % 9 !== 0;
  const isLoggedIn =
    hasGh && (inCodespaces || level === "advanced" || level === "actions-user" || seed % 4 !== 0);
  const hasApiKey = isLoggedIn && (level === "advanced" || seed % 5 !== 0);
  const hasCopilotRequestToken = isLoggedIn && (tool === "cloud-agent" || tool === "CCA" || seed % 2 === 0);
  const hasCopilotAccess =
    deployment !== "ghes" &&
    hasGithubSession &&
    (level === "advanced" ||
      level === "actions-user" ||
      (isEnterprise ? seed % 6 !== 0 : seed % (uiPreferred ? 4 : 5) !== 0));
  const inferenceProvider = deterministicChoice(seed + INFERENCE_PROVIDER_SEED_OFFSET, INFERENCE_PROVIDERS);
  const hasCopilotGithubToken =
    isLoggedIn &&
    (inferenceProvider === "github"
      ? seed % COPILOT_SECRET_PRIMARY_MODULO !== 0
      : seed % COPILOT_SECRET_SECONDARY_MODULO === 0);
  const hasAnthropicApiKey =
    isLoggedIn &&
    (inferenceProvider === "anthropic"
      ? hasThirdPartyProviderSecret(level, seed, ANTHROPIC_MISSING_REMAINDER)
      : seed % THIRD_PARTY_SECRET_SECONDARY_MODULO === 0);
  const hasOpenAiApiKey =
    isLoggedIn &&
    (inferenceProvider === "openai"
      ? hasThirdPartyProviderSecret(level, seed, OPENAI_MISSING_REMAINDER)
      : seed % THIRD_PARTY_SECRET_SECONDARY_MODULO === 1);
  const hasCopilotRequestsWrite =
    inferenceProvider === "github"
      ? seed % COPILOT_PERMISSION_GITHUB_MODULO !== 0
      : seed % COPILOT_PERMISSION_OTHER_MODULO !== 0;
  const baseConfidence = clamp(
    0.3 +
      (level === "advanced"
        ? 0.4
        : level === "actions-user"
        ? 0.28
        : level === "github-basic"
        ? 0.16
        : 0.02) +
      (priorSuccessRate * 0.16 + Math.min(priorRuns, 1500) / 1500 * 0.08),
    0.18,
    0.96
  );

  return deepFreeze({
    studentId: id,
    os,
    terminal,
    tool,
    installed: {
      gh: hasGh ? "2.58.0" : null,
      aw: hasAw ? "0.0.0" : null
    },
    auth: {
      isLoggedIn,
      hasGithubSession,
      hasCopilotAccess,
      accountType,
      hasApiKey,
      hasCopilotRequestToken,
      tokenScope
    },
    github: {
      deployment
    },
    workspace: {
      context: inCodespaces ? "codespaces" : "local",
      deviceClass: tool
    },
    actions: {
      inferenceProvider,
      permissions: {
        copilotRequestsWrite: hasCopilotRequestsWrite
      },
      secrets: {
        [PROVIDER_SECRET_BY_NAME.github]: hasCopilotGithubToken,
        [PROVIDER_SECRET_BY_NAME.anthropic]: hasAnthropicApiKey,
        [PROVIDER_SECRET_BY_NAME.openai]: hasOpenAiApiKey
      }
    },
    learner: {
      level,
      background,
      goal: String(student.goal || ""),
      personality: String(student.personality || ""),
      uiPreferred,
      priorRuns,
      priorSuccesses,
      priorSuccessRate,
      confidence: baseConfidence,
      mastery: {
        terminal: clamp(baseConfidence + (hasGh ? 0.08 : -0.18), 0, 1),
        github: clamp(baseConfidence + (hasGithubSession ? 0.08 : -0.15), 0, 1),
        actions: clamp(
          baseConfidence +
            (level === "advanced" ? 0.18 : level === "actions-user" ? 0.12 : level === "github-basic" ? -0.04 : -0.18),
          0,
          1
        ),
        agentic: clamp(
          baseConfidence +
            (level === "advanced" ? 0.15 : level === "actions-user" ? 0.06 : level === "github-basic" ? -0.02 : -0.12),
          0,
          1
        ),
        troubleshooting: clamp(
          baseConfidence +
            (background === "devops" || background === "enterprise-devops"
              ? 0.2
              : background === "backend-dev" || background === "enterprise-dev"
              ? 0.08
              : -0.08),
          0,
          1
        )
      }
    },
    flags: {
      sawActionsIntro: false,
      sawAgenticIntro: false,
      hasRepo: false,
      repoCreatedViaUi: false,
      repoHasReadme: false,
      repoVerified: false,
      hasWorkflowFile: false,
      ranWorkflow: false,
      environmentReady: false
    }
  });
}

function ensure(condition, failedAssumption, category, remediation) {
  if (!condition) {
    return { ok: false, failedAssumption, category, remediation };
  }
  return { ok: true };
}

function replayJourney({
  student,
  date,
  initialState,
  steps = [],
  transitions = {},
  stepContentById = {},
  runIndex = 0
}) {
  const dayOfYear = toDayOfYear(date);
  let state = deepFreeze(initialState || defaultEnvironmentForStudent(student, dayOfYear));
  const trace = [];

  for (const stepId of steps) {
    const transition = transitions[stepId];
    if (!transition) {
      return {
        success: false,
        firstFailingStep: stepId,
        category: "unknown-step",
        failedAssumption: `No transition implemented for step '${stepId}'`,
        remediation: "Add a transition implementation for the step.",
        trace,
        finalState: state
      };
    }

    const stepContent = stepContentById[stepId] || null;
    const result = transition(state, {
      student,
      date,
      runIndex,
      stepId,
      stepIndex: trace.length,
      totalSteps: steps.length,
      steps,
      stepContent
    });
    if (!result.ok) {
      return {
        success: false,
        firstFailingStep: stepId,
        category: result.category,
        failedAssumption: result.failedAssumption,
        remediation: result.remediation,
        trace,
        finalState: state,
        stepContent
      };
    }

    state = deepFreeze(result.state || state);
    trace.push({
      stepId,
      status: "ok",
      complexity: stepContent?.complexity ?? null,
      terminalDemand: stepContent?.terminalDemand ?? null
    });
  }

  return {
    success: true,
    firstFailingStep: null,
    category: null,
    failedAssumption: null,
    remediation: null,
    trace,
    finalState: state
  };
}

function replayWorkshop({ student, date, initialState, steps = [], transitions = {} }) {
  return replayJourney({ student, date, initialState, steps, transitions });
}

function simulateStudents(students, date, config = {}) {
  return students.map((student) => ({
    studentId: student.id,
    name: student.name,
    result: replayJourney({
      student,
      date,
      initialState:
        typeof config.initialStateForStudent === "function"
          ? config.initialStateForStudent(student, date)
          : config.initialState,
      steps: config.steps || [],
      transitions: config.transitions || {},
      stepContentById: config.stepContentById || {}
    })
  }));
}

function aggregateDropoutRates(monteCarlo, totalStudents, runsCount) {
  const dropoutRateByStep = {};
  for (const sr of monteCarlo) {
    for (const [step, count] of Object.entries(sr.failuresByStep)) {
      dropoutRateByStep[step] = (dropoutRateByStep[step] || 0) + count;
    }
  }
  const totalRuns = totalStudents * runsCount;
  for (const step of Object.keys(dropoutRateByStep)) {
    dropoutRateByStep[step] = dropoutRateByStep[step] / totalRuns;
  }
  return dropoutRateByStep;
}

function simulateStudentsMonteCarlo(students, date, runsCount = 100, config = {}) {
  const dayOfYear = toDayOfYear(date);
  return students.map((student) => {
    let successes = 0;
    const failuresByStep = {};

    for (let runIndex = 0; runIndex < runsCount; runIndex++) {
      const initialState =
        typeof config.initialStateForStudentAndRun === "function"
          ? config.initialStateForStudentAndRun(student, date, runIndex)
          : typeof config.initialStateForStudent === "function"
          ? config.initialStateForStudent(student, date)
          : defaultEnvironmentForStudent(student, dayOfYear, runIndex);

      const result = replayJourney({
        student,
        date,
        initialState,
        steps: config.steps || [],
        transitions: config.transitions || {},
        stepContentById: config.stepContentById || {},
        runIndex
      });

      if (result.success) {
        successes += 1;
      } else if (result.firstFailingStep) {
        failuresByStep[result.firstFailingStep] =
          (failuresByStep[result.firstFailingStep] || 0) + 1;
      }
    }

    const sortedFailures = Object.entries(failuresByStep).sort(([, a], [, b]) => b - a);
    return {
      studentId: student.id,
      name: student.name,
      runs: runsCount,
      successes,
      successRate: successes / runsCount,
      failuresByStep,
      mostCommonFailureStep: sortedFailures.length > 0 ? sortedFailures[0][0] : null
    };
  });
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--students") args.studentsPath = argv[++i];
    else if (arg === "--date") args.date = argv[++i];
    else if (arg === "--out") args.outPath = argv[++i];
    else if (arg === "--journey") args.journeyPath = argv[++i];
    else if (arg === "--curriculum") args.curriculumPath = argv[++i];
    else if (arg === "--agent-insights") args.agentInsightsPath = argv[++i];
    else if (arg === "--runs") args.runsCount = parseInt(argv[++i], 10);
  }
  return args;
}

function runCli() {
  const { studentsPath, date, outPath, journeyPath, curriculumPath, agentInsightsPath, runsCount } = parseArgs(process.argv);
  if (!studentsPath) {
    throw new Error("Missing required --students <path> argument.");
  }
  if (!journeyPath) {
    throw new Error("Missing required --journey <path> argument.");
  }

  const today = date || new Date().toISOString().slice(0, 10);
  const raw = JSON.parse(fs.readFileSync(studentsPath, "utf8"));
  const students = Array.isArray(raw) ? raw : raw.students;
  if (!Array.isArray(students)) {
    throw new Error("Input JSON must be an array or contain a 'students' array.");
  }
  const journeyModule = require(path.resolve(journeyPath));
  const steps = journeyModule.steps || journeyModule.STEP_IDS || [];
  const transitions = journeyModule.transitions || journeyModule.buildTransitions?.();
  if (!Array.isArray(steps)) {
    throw new Error("Journey module must export a 'steps' (or 'STEP_IDS') array.");
  }
  if (!transitions || typeof transitions !== "object") {
    throw new Error(
      "Journey module must export 'transitions' object or 'buildTransitions()' function."
    );
  }
  const curriculum = curriculumPath ? JSON.parse(fs.readFileSync(path.resolve(curriculumPath), "utf8")) : null;
  const agentInsightsByStep = agentInsightsPath
    ? normalizeAgentInsightsByStep(JSON.parse(fs.readFileSync(path.resolve(agentInsightsPath), "utf8")))
    : {};
  const stepContentById = buildStepContentById({
    steps,
    curriculum,
    stepFilesById: journeyModule.stepFilesById || journeyModule.STEP_FILE_ALIASES || {},
    repoRoot: process.cwd(),
    agentInsightsByStep
  });

  let results;
  if (runsCount && runsCount > 1) {
    const monteCarlo = simulateStudentsMonteCarlo(students, today, runsCount, {
      steps,
      transitions,
      stepContentById
    });
    results = {
      date: today,
      mode: "monte-carlo",
      runs: runsCount,
      total: students.length,
      stepContentById,
      monteCarlo,
      aggregate: {
        overallSuccessRate:
          monteCarlo.reduce((sum, r) => sum + r.successRate, 0) / monteCarlo.length,
        dropoutRateByStep: aggregateDropoutRates(monteCarlo, students.length, runsCount)
      }
    };
  } else {
    results = {
      date: today,
      mode: "single",
      total: students.length,
      stepContentById,
      results: simulateStudents(students, today, { steps, transitions, stepContentById })
    };
  }

  const output = JSON.stringify(results, null, 2);
  if (outPath) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, output);
  } else {
    process.stdout.write(`${output}\n`);
  }
}

const exportedApi = {
  VALID_TERMINALS,
  INFERENCE_PROVIDERS,
  PROVIDER_SECRET_BY_NAME,
  ensure,
  clamp,
  stableHash,
  analyzeStepMarkdown,
  buildStepContentById,
  normalizeAgentInsightsByStep,
  defaultEnvironmentForStudent,
  replayJourney,
  replayWorkshop,
  simulateStudents,
  simulateStudentsMonteCarlo,
  aggregateDropoutRates
};

module.exports = exportedApi;

if (require.main === module) {
  runCli();
}
