"use strict";

const DAY_MS = 24 * 60 * 60 * 1000;
const RUN_INDEX_SEED_FACTOR = 31;

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

function defaultEnvironmentForStudent(student, dayOfYear, runIndex = 0) {
  const id = Number(student.id || 0);
  const seed = id * 97 + dayOfYear * 17 + runIndex * RUN_INDEX_SEED_FACTOR;
  const background = String(student.background || "");
  const level = String(student.level || "");

  const isEnterprise = background === "enterprise-dev" || background === "enterprise-devops";
  const deployment = isEnterprise
    ? deterministicChoice(seed + 1, ["ghec", "ghes"])
    : "github.com";
  const accountType = isEnterprise ? "enterprise-managed" : "personal";

  const os = deterministicChoice(seed + 2, ["macos", "linux", "windows"]);
  const terminal = deterministicChoice(seed + 3, Array.from(VALID_TERMINALS[os]));

  const hasGh = level !== "beginner" || seed % 3 !== 0;
  const hasAw = false;
  const inCodespaces = student.tool === "vscode" ? seed % 2 === 0 : seed % 3 === 0;
  const tokenScope = inCodespaces && isEnterprise ? "org" : "user";
  const isLoggedIn =
    hasGh && (inCodespaces || level === "advanced" || level === "actions-user" || seed % 4 !== 0);
  const hasApiKey = isLoggedIn && (level === "advanced" || seed % 5 !== 0);
  const hasCopilotRequestToken = isLoggedIn && (student.tool === "cloud-agent" || seed % 2 === 0);
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

  return deepFreeze({
    studentId: id,
    os,
    terminal,
    tool: student.tool || "cli",
    installed: {
      gh: hasGh ? "2.58.0" : null,
      aw: hasAw ? "0.0.0" : null
    },
    auth: {
      isLoggedIn,
      accountType,
      hasApiKey,
      hasCopilotRequestToken,
      tokenScope
    },
    github: {
      deployment
    },
    workspace: {
      context: inCodespaces ? "codespaces" : "local"
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

function replayJourney({ student, date, initialState, steps = [], transitions = {} }) {
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

    const result = transition(state);
    if (!result.ok) {
      return {
        success: false,
        firstFailingStep: stepId,
        category: result.category,
        failedAssumption: result.failedAssumption,
        remediation: result.remediation,
        trace,
        finalState: state
      };
    }

    state = deepFreeze(result.state || state);
    trace.push({ stepId, status: "ok" });
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
      transitions: config.transitions || {}
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
        transitions: config.transitions || {}
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
    else if (arg === "--runs") args.runsCount = parseInt(argv[++i], 10);
  }
  return args;
}

function runCli() {
  const fs = require("node:fs");
  const path = require("node:path");
  const { studentsPath, date, outPath, journeyPath, runsCount } = parseArgs(process.argv);
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

  let results;
  if (runsCount && runsCount > 1) {
    const monteCarlo = simulateStudentsMonteCarlo(students, today, runsCount, { steps, transitions });
    results = {
      date: today,
      mode: "monte-carlo",
      runs: runsCount,
      total: students.length,
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
      results: simulateStudents(students, today, { steps, transitions })
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
