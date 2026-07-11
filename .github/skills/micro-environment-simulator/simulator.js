"use strict";

const DAY_MS = 24 * 60 * 60 * 1000;

const VALID_TERMINALS = {
  macos: new Set(["bash", "zsh"]),
  linux: new Set(["bash", "zsh"]),
  windows: new Set(["powershell", "cmd"])
};

function toDayOfYear(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  return Math.floor((date - start) / DAY_MS);
}

function deterministicChoice(seed, choices) {
  const index = Math.abs(seed) % choices.length;
  return choices[index];
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

function defaultEnvironmentForStudent(student, dayOfYear) {
  const id = Number(student.id || 0);
  const seed = id * 97 + dayOfYear * 17;
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
  const isLoggedIn = hasGh && (level === "advanced" || level === "actions-user" || seed % 4 !== 0);

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
      accountType
    },
    github: {
      deployment
    },
    flags: {
      sawActionsIntro: false,
      sawAgenticIntro: false,
      hasRepo: false,
      hasWorkflowFile: false,
      ranWorkflow: false
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

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--students") args.studentsPath = argv[++i];
    else if (arg === "--date") args.date = argv[++i];
    else if (arg === "--out") args.outPath = argv[++i];
    else if (arg === "--journey") args.journeyPath = argv[++i];
  }
  return args;
}

function runCli() {
  const fs = require("node:fs");
  const path = require("node:path");
  const { studentsPath, date, outPath, journeyPath } = parseArgs(process.argv);
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

  const results = {
    date: today,
    total: students.length,
    results: simulateStudents(students, today, { steps, transitions })
  };

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
  ensure,
  defaultEnvironmentForStudent,
  replayJourney,
  replayWorkshop,
  simulateStudents
};

module.exports = exportedApi;

if (require.main === module) {
  runCli();
}
