"use strict";

const DAY_MS = 24 * 60 * 60 * 1000;
const PROFILE_SCHEMA_VERSION = 4;
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
const INFERENCE_PROVIDERS = ["github"];
const WORD_COUNT_COMPLEXITY_THRESHOLD = 1400;
const COMMAND_LINE_COMPLEXITY_THRESHOLD = 18;
const CALLOUT_COMPLEXITY_THRESHOLD = 18;
const OPTIONAL_PATH_COMPLEXITY_THRESHOLD = 10;
const COMMAND_BLOCK_TERMINAL_WEIGHT = 0.18;
const COMMAND_LINE_TERMINAL_WEIGHT = 0.03;
const TERMINAL_DEMAND_CAP = 0.95;
const UI_ALTERNATIVE_TERMINAL_DISCOUNT = 0.1;
const UI_ALTERNATIVE_TERMINAL_DISCOUNT_CAP = 0.3;
const AGENT_ADJUSTMENT_LIMIT = 0.15;
const SEMANTIC_SCORE_WEIGHTS = {
  stateReadiness: 0.5,
  pathClarity: 0.3,
  recoverySupport: 0.2
};
const SEMANTIC_SCORE_PROBABILITY_SCALE = 0.002;

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

function createSeededRng(seed) {
  // Mulberry32 provides a small reproducible stream for simulation, not cryptographic randomness.
  let state = Number(seed) >>> 0;
  return function nextRandom() {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function randomFor(...parts) {
  return createSeededRng(stableHash(parts.join("|")))();
}

function weightedChoice(random, weights, label = "distribution") {
  const entries = Object.entries(weights || {});
  if (entries.length === 0) {
    throw new Error(`Population model '${label}' must contain at least one weighted value.`);
  }
  if (entries.some(([, weight]) => !Number.isFinite(Number(weight)) || Number(weight) <= 0)) {
    throw new Error(`Population model '${label}' weights must be positive finite numbers.`);
  }
  const total = entries.reduce((sum, [, weight]) => sum + Number(weight), 0);
  if (Math.abs(total - 1) > 1e-6) {
    throw new Error(`Population model '${label}' weights must sum to 1; received ${total}.`);
  }
  let cursor = random() * total;
  for (const [value, weight] of entries) {
    cursor -= Number(weight);
    if (cursor < 0) return value;
  }
  return entries[entries.length - 1][0];
}

function generateSyntheticStudents(populationModel, seed = "workshop-students") {
  const distributions = populationModel?.distributions || {};
  const cohortSize = Number(populationModel?.cohortSize);
  if (!Number.isInteger(cohortSize) || cohortSize <= 0) {
    throw new Error("Population model must define a positive integer 'cohortSize'.");
  }
  const random = createSeededRng(stableHash(`${populationModel.modelVersion}|${seed}`));
  const students = [];
  for (let index = 0; index < cohortSize; index += 1) {
    const level = weightedChoice(random, distributions.level, "level");
    const background = weightedChoice(
      random,
      distributions.backgroundByLevel?.[level],
      `backgroundByLevel.${level}`
    );
    const personality = weightedChoice(random, distributions.personality, "personality");
    const goal = weightedChoice(random, distributions.goalByLevel?.[level], `goalByLevel.${level}`);
    const tool = weightedChoice(random, distributions.toolByLevel?.[level], `toolByLevel.${level}`);
    const uiPreferred = random() < Number(distributions.uiPreferredProbabilityByTool?.[tool] || 0);
    const mobile = random() < Number(distributions.mobileProbabilityByTool?.[tool] || 0);
    students.push({
      id: index + 1,
      name: `Learner ${String(index + 1).padStart(3, "0")}`,
      level,
      personality,
      background,
      goal,
      tool,
      ui_preferred: uiPreferred,
      ...(mobile ? { mobile: true } : {}),
      runs: 0,
      successes: 0
    });
  }
  return {
    version: PROFILE_SCHEMA_VERSION,
    population_model_version: populationModel.modelVersion,
    population_model_hash: stableHash(JSON.stringify(populationModel)),
    cohort_seed: seed,
    students
  };
}

function toDayOfYear(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  return Math.floor((date - start) / DAY_MS);
}

function deterministicChoice(seed, choices) {
  const index = Math.floor(randomFor(seed, "choice") * choices.length);
  return choices[index];
}

function resolveRepositoryOwnerType(student, isEnterprise, seed) {
  if (isEnterprise) {
    return "enterprise-organization";
  }
  const goal = String(student.goal || "");
  if (goal === "team-evaluation") {
    return "organization";
  }
  if (goal === "work-project") {
    return seed % 10 < 7 ? "organization" : "personal";
  }
  if (goal === "teaching-others") {
    return seed % 10 < 4 ? "organization" : "personal";
  }
  return "personal";
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
  const agentsPromptCueCount = countMatches(
    text,
    /\b(prompt|paste this prompt|send this prompt|ask Copilot|ask the agent|type this prompt)\b/gi
  );
  const authCueCount = countMatches(
    text,
    /\b(auth|login|signed in|token|Copilot|permissions?|403|secret)\b/gi
  );
  const agenticWorkflowSkillCueCount = countMatches(text, /\/agentic-workflows\b/gi);
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
  const workflowCompileCueCount = countMatches(text, /\bgh aw compile(?:\s|`|$)|\.lock\.yml\b|compiled?\b/gi);
  const workflowLockPublishCueCount = countMatches(
    text,
    /\.lock\.yml[\s\S]{0,500}\b(commit(?: changes)?|push|approve the commit)\b|\b(commit(?: changes)?|push|approve the commit)\b[\s\S]{0,500}\.lock\.yml/gi
  );
  const copilotRequestsWriteCueCount = countMatches(
    text,
    /^\s*copilot-requests:\s*write\s*(?:#.*)?$/gim
  );
  const copilotGithubTokenCueCount = countMatches(text, /\bCOPILOT_GITHUB_TOKEN\b/g);
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
    agentsPromptCueCount,
    uiAlternativeCount,
    workflowCompileCueCount,
    workflowLockPublishCueCount,
    copilotRequestsWriteCueCount,
    copilotGithubTokenCueCount,
    agenticWorkflowSkillCueCount,
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

function normalizeBoundedAdjustments(container, fieldName, stepId, allowedKeys) {
  normalizeNumericObject(container, fieldName, stepId);
  if (!isPlainObject(container[fieldName])) {
    return;
  }
  const allowedKeySet = new Set(allowedKeys);
  for (const key of Object.keys(container[fieldName])) {
    if (!allowedKeySet.has(key)) {
      console.warn(`[simulator] Ignoring unknown adjustment '${stepId}.${fieldName}.${key}'.`);
      delete container[fieldName][key];
      continue;
    }
    container[fieldName][key] = clamp(
      container[fieldName][key],
      -AGENT_ADJUSTMENT_LIMIT,
      AGENT_ADJUSTMENT_LIMIT
    );
  }
}

function normalizeSemanticScores(container, stepId) {
  if (container.semanticScores == null) {
    return;
  }
  if (!isPlainObject(container.semanticScores)) {
    console.warn(`[simulator] Agent insight '${stepId}.semanticScores' should be an object.`);
    delete container.semanticScores;
    return;
  }
  const scores = {};
  let valid = true;
  for (const field of Object.keys(SEMANTIC_SCORE_WEIGHTS)) {
    const rawValue = container.semanticScores[field];
    const value = Number(rawValue);
    if (rawValue == null || !Number.isFinite(value)) {
      console.warn(`[simulator] Agent insight '${stepId}.semanticScores.${field}' should be numeric.`);
      valid = false;
      continue;
    }
    scores[field] = clamp(value, 0, 100);
  }
  if (valid) {
    container.semanticScores = scores;
  } else {
    delete container.semanticScores;
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
    normalizeNumericField(nextInsight, "rank", stepId);
    normalizeNumericField(nextInsight, "bias", stepId);
    if (nextInsight.bias != null) {
      nextInsight.bias = clamp(nextInsight.bias, -AGENT_ADJUSTMENT_LIMIT, AGENT_ADJUSTMENT_LIMIT);
    }
    normalizeSemanticScores(nextInsight, stepId);
    normalizeBoundedAdjustments(nextInsight, "signalAdjustments", stepId, [
      "complexity",
      "terminalDemand",
      "browserSupport",
      "authDemand",
      "troubleshootingSupport",
      "conceptDemand",
      "enterpriseDemand"
    ]);
    normalizeBoundedAdjustments(nextInsight, "pathAdjustments", stepId, [
      "browser",
      "cli",
      "codespaces",
      "local",
      "mobile",
      "uiPreferred",
      "enterprise"
    ]);
    normalizeNumericField(nextInsight, "evaluatedContentHash", stepId);
    if (nextInsight.evaluations !== null && nextInsight.evaluations !== undefined) {
      if (!isPlainObject(nextInsight.evaluations)) {
        console.warn(`[simulator] Agent insight '${stepId}.evaluations' should be an object.`);
        delete nextInsight.evaluations;
      } else {
        const evaluations = {};
        for (const [evaluationId, evaluation] of Object.entries(nextInsight.evaluations)) {
          if (!isPlainObject(evaluation)) {
            console.warn(
              `[simulator] Ignoring malformed evaluation '${stepId}.${evaluationId}': expected an object.`
            );
            continue;
          }
          const answer = String(evaluation.answer ?? "").toUpperCase();
          if (!["YES", "NO", "UNKNOWN"].includes(answer)) {
            console.warn(
              `[simulator] Ignoring malformed evaluation '${stepId}.${evaluationId}': answer must be YES, NO, or UNKNOWN.`
            );
            continue;
          }
          evaluations[evaluationId] = {
            answer,
            ...(typeof evaluation.question === "string" ? { question: evaluation.question } : {}),
            evidence: Array.isArray(evaluation.evidence)
              ? evaluation.evidence.filter((item) => typeof item === "string")
              : []
          };
        }
        nextInsight.evaluations = evaluations;
      }
    }
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
    const fileContents = existingFiles.map((file) => ({
      file,
      title: curriculumByFile.get(file)?.title || file.replace(/\.md$/i, ""),
      markdown: fs.readFileSync(path.resolve(workshopDir, file), "utf8")
    }));
    const markdown = fileContents.map(({ markdown: fileMarkdown }) => fileMarkdown).join("\n\n");
    const contentAnalysis = analyzeStepMarkdown(
      stepId,
      markdown,
      fileContents.map(({ file, title }) => ({ file, title }))
    );
    const rawAgentInsight = agentInsightsByStep[stepId] || null;
    let agentInsight = rawAgentInsight;
    // Every model-affecting insight is tied to the exact page revision it evaluated.
    if (
      rawAgentInsight &&
      Number(rawAgentInsight.evaluatedContentHash) !== contentAnalysis.contentHash
    ) {
      console.warn(
        `[simulator] Ignoring stale agent insight for step '${stepId}': content hash does not match.`
      );
      agentInsight = null;
    } else if (rawAgentInsight) {
      agentInsight = { ...rawAgentInsight };
    }
    stepContentById[stepId] = deepFreeze({
      ...contentAnalysis,
      fileSignals: fileContents.map(({ file, title, markdown: fileMarkdown }) =>
        deepFreeze({
          file,
          title,
          ...analyzeStepMarkdown(file, fileMarkdown, [{ file, title }])
        })
      ),
      agentInsight
    });
  }

  return deepFreeze(stepContentById);
}

function defaultEnvironmentForStudent(student, dayOfYear, runIndex = 0) {
  const id = Number(student.id || 0);
  const random = (dimension) => randomFor(dayOfYear, id, runIndex, dimension);
  const background = String(student.background || "");
  const level = String(student.level || "");
  const tool = String(student.tool || "cli");
  const onMobile = Boolean(student.mobile);
  const uiPreferred = Boolean(student.ui_preferred);
  const priorRuns = Number(student.runs || 0);
  const priorSuccesses = Number(student.successes || 0);
  const priorSuccessRate = priorRuns > 0 ? priorSuccesses / priorRuns : 0;

  const isEnterprise = background === "enterprise-dev" || background === "enterprise-devops";
  const deployment = isEnterprise
    ? random("deployment") < 0.78
      ? "ghec"
      : "ghes"
    : "github.com";
  const accountType = isEnterprise ? "enterprise-managed" : "personal";
  const repositoryOwnerType = resolveRepositoryOwnerType(
    student,
    isEnterprise,
    Math.floor(random("repository-owner") * 1000)
  );

  const osRoll = random("os");
  const os = osRoll < 0.5 ? "windows" : osRoll < 0.77 ? "macos" : "linux";
  const terminal = deterministicChoice(
    stableHash(`${dayOfYear}|${id}|${runIndex}|terminal`),
    Array.from(VALID_TERMINALS[os])
  );

  const inCodespaces =
    onMobile
      ? false
      : tool === "CCA"
      ? random("codespaces") < 0.4
      : tool === "vscode"
      ? random("codespaces") < 0.6
      : random("codespaces") < 0.2;
  const hasGh = onMobile
    ? false
    : inCodespaces || random("gh-installed") < ({ beginner: 0.55, "github-basic": 0.82, "actions-user": 0.94, advanced: 0.98 }[level] || 0.75);
  const hasAw = false;
  const tokenScope = inCodespaces && isEnterprise ? "org" : "user";
  const hasGithubSession = onMobile || random("github-session") < 0.89;
  const isLoggedIn =
    hasGh &&
    (inCodespaces ||
      random("gh-login") <
        ({ beginner: 0.58, "github-basic": 0.76, "actions-user": 0.9, advanced: 0.96 }[level] || 0.75));
  const hasApiKey = isLoggedIn && random("api-key") < (level === "advanced" ? 0.9 : 0.72);
  const hasCopilotRequestToken =
    isLoggedIn && (tool === "CCA" || random("copilot-request-token") < 0.5);
  const hasCopilotAccess =
    deployment !== "ghes" &&
    hasGithubSession &&
    (level === "advanced" ||
      level === "actions-user" ||
      random("copilot-access") < (isEnterprise ? 0.83 : uiPreferred ? 0.78 : 0.8));
  const inferenceProvider = "github";
  // Model a mixed organization cohort: enterprise organizations have centralized
  // billing, while half of other organizations have enabled it.
  const centralizedCopilotBilling =
    repositoryOwnerType !== "personal" && (isEnterprise || random("centralized-billing") < 0.5);
  // The Step 7 transition fills these fields after the required model-access activity.
  const hasCopilotGithubToken = null;
  const hasAnthropicApiKey = null;
  const hasOpenAiApiKey = null;
  const hasCopilotRequestsWrite = null;
  const personalityConfidence = {
    curious: 0.04,
    methodical: 0.03,
    impatient: 0.02,
    confused: -0.1,
    skeptical: -0.03
  };
  const baseConfidence = clamp(0.52 + (personalityConfidence[student.personality] || 0), 0.25, 0.8);
  // Capture good-day/bad-day variation shared across every step in one simulated journey.
  const sessionEffect = clamp(
    (random("session-effect-a") + random("session-effect-b") - 1) * 0.18,
    -0.16,
    0.16
  );

  return deepFreeze({
    studentId: id,
    os,
    terminal,
    tool,
    mobile: onMobile,
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
      deployment,
      repositoryOwnerType
    },
    workspace: {
      context: inCodespaces ? "codespaces" : "local",
      deviceClass: onMobile ? "mobile" : tool
    },
    actions: {
      inferenceProvider,
      centralizedCopilotBilling,
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
      sessionEffect,
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
      awSkillInitialized: false,
      awSkillPushed: false,
      hasRepo: false,
      repoCreatedViaUi: false,
      repoHasReadme: false,
      repoVerified: false,
      hasWorkflowFile: false,
      hasCompiledWorkflowLock: false,
      hasPushedCompiledWorkflowLock: false,
      ranWorkflow: false,
      workflowReadyToRun: false,
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
  runIndex = 0,
  random,
  onStepAttempt
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
    const context = {
      student,
      date,
      runIndex,
      stepId,
      stepIndex: trace.length,
      totalSteps: steps.length,
      steps,
      stepContent,
      random:
        typeof random === "function"
          ? random
          : createSeededRng(stableHash(`${date}|${student.id}|${runIndex}|${stepId}`))
    };
    if (typeof onStepAttempt === "function") {
      onStepAttempt({
        state,
        stepId,
        stepIndex: trace.length,
        totalSteps: steps.length,
        stepContent,
        context
      });
    }
    const result = transition(state, context);
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

// Wilson score interval; z=1.96 produces a 95% interval. Empty samples return null bounds.
function wilsonInterval(successes, attempts, z = 1.96) {
  if (
    !Number.isFinite(successes) ||
    !Number.isFinite(attempts) ||
    successes < 0 ||
    attempts < 0 ||
    successes > attempts
  ) {
    throw new Error("Wilson interval requires 0 <= successes <= attempts.");
  }
  if (!attempts) return { low: null, high: null };
  const proportion = successes / attempts;
  const denominator = 1 + (z * z) / attempts;
  const center = (proportion + (z * z) / (2 * attempts)) / denominator;
  const margin =
    (z / denominator) *
    Math.sqrt((proportion * (1 - proportion)) / attempts + (z * z) / (4 * attempts * attempts));
  return {
    low: clamp(center - margin, 0, 1),
    high: clamp(center + margin, 0, 1)
  };
}

// Rates are conditional on attempts; steps with no at-risk runs receive a null rate and interval.
function aggregateDropoutRates(monteCarlo, steps = []) {
  const dropoutRateByStep = {};
  const attemptsByStep = {};
  const failuresByStep = {};
  const dropoutRateCi95ByStep = {};
  for (const sr of monteCarlo) {
    for (const [step, count] of Object.entries(sr.failuresByStep)) {
      failuresByStep[step] = (failuresByStep[step] || 0) + count;
    }
    for (const [step, count] of Object.entries(sr.attemptsByStep || {})) {
      attemptsByStep[step] = (attemptsByStep[step] || 0) + count;
    }
  }
  for (const step of steps) {
    const attempts = attemptsByStep[step] || 0;
    const failures = failuresByStep[step] || 0;
    dropoutRateByStep[step] = attempts ? failures / attempts : null;
    dropoutRateCi95ByStep[step] = wilsonInterval(failures, attempts);
  }
  return { dropoutRateByStep, dropoutRateCi95ByStep, attemptsByStep, failuresByStep };
}

function aggregateFailureCategories(monteCarlo) {
  const failureCategoriesByStep = {};
  for (const result of monteCarlo) {
    for (const [stepId, categories] of Object.entries(result.failureCategoriesByStep || {})) {
      failureCategoriesByStep[stepId] ||= {};
      for (const [category, count] of Object.entries(categories)) {
        failureCategoriesByStep[stepId][category] =
          (failureCategoriesByStep[stepId][category] || 0) + count;
      }
    }
  }
  return failureCategoriesByStep;
}

function createStepGreekAccumulator() {
  return {
    signalKeys: [],
    signalKeySet: new Set(),
    sumsByStep: {},
    attemptsByStep: {}
  };
}

function recordStepGreekEstimate(accumulator, stepId, greeks) {
  if (!accumulator || !stepId || !greeks || typeof greeks !== "object") {
    return;
  }
  const entries = Object.entries(greeks).filter(([, value]) => Number.isFinite(Number(value)));
  if (entries.length === 0) {
    return;
  }
  accumulator.attemptsByStep[stepId] = (accumulator.attemptsByStep[stepId] || 0) + 1;
  accumulator.sumsByStep[stepId] ||= {};
  for (const [signal, value] of entries) {
    if (!accumulator.signalKeySet.has(signal)) {
      accumulator.signalKeySet.add(signal);
      accumulator.signalKeys.push(signal);
    }
    accumulator.sumsByStep[stepId][signal] = (accumulator.sumsByStep[stepId][signal] || 0) + Number(value);
  }
}

function finalizeStepGreekAccumulator(accumulator, totalAttempts = 0, steps = []) {
  if (!accumulator || accumulator.signalKeys.length === 0) {
    return null;
  }
  const stepIds = steps.length > 0 ? steps : Object.keys(accumulator.sumsByStep);
  const conditionalSuccessRateByStep = {};
  const overallSuccessRateByStep = {};
  for (const stepId of stepIds) {
    const attempts = accumulator.attemptsByStep[stepId] || 0;
    const sums = accumulator.sumsByStep[stepId] || {};
    conditionalSuccessRateByStep[stepId] = {};
    overallSuccessRateByStep[stepId] = {};
    for (const signal of accumulator.signalKeys) {
      const sum = Number(sums[signal] || 0);
      conditionalSuccessRateByStep[stepId][signal] = attempts ? sum / attempts : null;
      overallSuccessRateByStep[stepId][signal] = totalAttempts ? sum / totalAttempts : null;
    }
  }
  return {
    algorithm: "vandendorpe-reached-state",
    interpretation:
      "First-order sensitivities of modeled success rates to step-content signals, reusing the Monte Carlo cohort's reached states instead of bump-and-reprice reruns.",
    signals: [...accumulator.signalKeys],
    atRiskRunsByStep: { ...accumulator.attemptsByStep },
    conditionalSuccessRateByStep,
    overallSuccessRateByStep
  };
}

function simulateStudentsMonteCarlo(students, date, runsCount = 100, config = {}) {
  const dayOfYear = toDayOfYear(date);
  return students.map((student) => {
    let successes = 0;
    const failuresByStep = {};
    const failureCategoriesByStep = {};
    const attemptsByStep = {};

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
        runIndex,
        random: createSeededRng(stableHash(`${date}|${student.id}|${runIndex}|journey`)),
        onStepAttempt:
          typeof config.stepGreekEstimator === "function" && config.stepGreekAccumulator
            ? ({ state: stepState, stepId, context }) => {
                const estimate = config.stepGreekEstimator(stepState, context);
                recordStepGreekEstimate(
                  config.stepGreekAccumulator,
                  stepId,
                  estimate?.greeks || estimate
                );
              }
            : undefined
      });

      for (const { stepId } of result.trace) {
        attemptsByStep[stepId] = (attemptsByStep[stepId] || 0) + 1;
      }
      if (!result.success && result.firstFailingStep) {
        attemptsByStep[result.firstFailingStep] = (attemptsByStep[result.firstFailingStep] || 0) + 1;
      }

      if (result.success) {
        successes += 1;
      } else if (result.firstFailingStep) {
        failuresByStep[result.firstFailingStep] =
          (failuresByStep[result.firstFailingStep] || 0) + 1;
        const category = result.category || "unknown";
        failureCategoriesByStep[result.firstFailingStep] ||= {};
        failureCategoriesByStep[result.firstFailingStep][category] =
          (failureCategoriesByStep[result.firstFailingStep][category] || 0) + 1;
      }
    }

    const sortedFailures = Object.entries(failuresByStep).sort(([, a], [, b]) => b - a);
    return {
      studentId: student.id,
      name: student.name,
      runs: runsCount,
      successes,
      successRate: successes / runsCount,
      successRateCi95: wilsonInterval(successes, runsCount),
      failuresByStep,
      attemptsByStep,
      failureCategoriesByStep,
      mostCommonFailureStep: sortedFailures.length > 0 ? sortedFailures[0][0] : null
    };
  });
}

function simulateStudentsMonteCarloWithGreeks(students, date, runsCount = 100, config = {}) {
  const stepGreekAccumulator =
    typeof config.stepGreekEstimator === "function" ? createStepGreekAccumulator() : null;
  const monteCarlo = simulateStudentsMonteCarlo(students, date, runsCount, {
    ...config,
    stepGreekAccumulator
  });
  return {
    monteCarlo,
    greeks: finalizeStepGreekAccumulator(stepGreekAccumulator, students.length * runsCount, config.steps || [])
  };
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
    else if (arg === "--generate-population") args.generatePopulation = true;
    else if (arg === "--population-model") args.populationModelPath = argv[++i];
    else if (arg === "--seed") args.seed = argv[++i];
  }
  return args;
}

function runCli() {
  const {
    studentsPath,
    date,
    outPath,
    journeyPath,
    curriculumPath,
    agentInsightsPath,
    runsCount,
    generatePopulation,
    populationModelPath,
    seed
  } = parseArgs(process.argv);
  if (generatePopulation) {
    if (!populationModelPath || !outPath) {
      throw new Error("--generate-population requires --population-model <path> and --out <path>.");
    }
    const populationModel = JSON.parse(fs.readFileSync(path.resolve(populationModelPath), "utf8"));
    const generated = generateSyntheticStudents(populationModel, seed);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, `${JSON.stringify(generated, null, 2)}\n`);
    return;
  }
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
    const monteCarloResults = simulateStudentsMonteCarloWithGreeks(students, today, runsCount, {
      steps,
      transitions,
      stepContentById,
      stepGreekEstimator: journeyModule.stepGreekEstimator
    });
    const { monteCarlo, greeks } = monteCarloResults;
    const dropout = aggregateDropoutRates(monteCarlo, steps);
    const totalSuccesses = monteCarlo.reduce((sum, result) => sum + result.successes, 0);
    const totalAttempts = students.length * runsCount;
    results = {
      date: today,
      mode: "monte-carlo",
      runs: runsCount,
      total: students.length,
      stepContentById,
      monteCarlo,
      model: {
        journeyModelVersion: journeyModule.modelVersion || "unversioned",
        populationModelVersion: raw.population_model_version || "legacy-fixed-cohort",
        populationModelHash: raw.population_model_hash || null,
        parameterHash: stableHash(
          JSON.stringify({
            journeyModelParameters: journeyModule.modelParameters || null,
            populationModelHash: raw.population_model_hash || null
          })
        ),
        intervalCaveat:
          "Intervals quantify Monte Carlo sampling error only; they do not quantify uncertainty in model assumptions."
      },
      aggregate: {
        overallSuccessRate: totalSuccesses / totalAttempts,
        overallSuccessRateCi95: wilsonInterval(totalSuccesses, totalAttempts),
        dropoutRateByStep: dropout.dropoutRateByStep,
        dropoutRateCi95ByStep: dropout.dropoutRateCi95ByStep,
        attemptsByStep: dropout.attemptsByStep,
        dropoutCountByStep: dropout.failuresByStep,
        failureCategoriesByStep: aggregateFailureCategories(monteCarlo),
        greeks
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
  SEMANTIC_SCORE_WEIGHTS,
  SEMANTIC_SCORE_PROBABILITY_SCALE,
  ensure,
  clamp,
  stableHash,
  createSeededRng,
  randomFor,
  weightedChoice,
  generateSyntheticStudents,
  analyzeStepMarkdown,
  buildStepContentById,
  normalizeAgentInsightsByStep,
  defaultEnvironmentForStudent,
  replayJourney,
  replayWorkshop,
  simulateStudents,
  simulateStudentsMonteCarlo,
  simulateStudentsMonteCarloWithGreeks,
  wilsonInterval,
  aggregateDropoutRates,
  aggregateFailureCategories,
  createStepGreekAccumulator,
  finalizeStepGreekAccumulator
};

module.exports = exportedApi;

if (require.main === module) {
  runCli();
}
