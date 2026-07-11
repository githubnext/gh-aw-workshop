"use strict";

const DAY_MS = 24 * 60 * 60 * 1000;

const STEP_IDS = [
  "00-welcome",
  "01-prerequisites",
  "02-setup",
  "03-create-repo",
  "04-actions-intro",
  "05-agentic-intro",
  "06-install-gh-aw",
  "07-first-workflow",
  "08-run-workflow",
  "09-understand-output",
  "10-design",
  "11-build",
  "12-test-iterate",
  "13-schedule",
  "14-next-steps"
];

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

function buildTransitions() {
  return {
    "00-welcome": (state) => ({ ok: true, state }),
    "01-prerequisites": (state) =>
      ensure(
        Boolean(state.os && state.terminal && state.auth && state.github),
        "Missing base environment metadata (os/terminal/auth/deployment)",
        "environment-metadata-missing",
        "Initialize environment with os, terminal, auth, and deployment fields before replay."
      ),
    "02-setup": (state) =>
      ensure(
        VALID_TERMINALS[state.os] && VALID_TERMINALS[state.os].has(state.terminal),
        `Terminal '${state.terminal}' is not valid for OS '${state.os}'`,
        "terminal-os-mismatch",
        "Use bash/zsh for macOS/Linux and powershell/cmd for Windows."
      ),
    "03-create-repo": (state) => {
      const precheck = ensure(
        state.auth.isLoggedIn,
        "User is not logged into GitHub CLI",
        "github-auth-missing",
        "Run `gh auth login` before repository operations."
      );
      if (!precheck.ok) return precheck;
      const next = cloneState(state);
      next.flags.hasRepo = true;
      return { ok: true, state: deepFreeze(next) };
    },
    "04-actions-intro": (state) => {
      const next = cloneState(state);
      next.flags.sawActionsIntro = true;
      return { ok: true, state: deepFreeze(next) };
    },
    "05-agentic-intro": (state) => {
      if (state.github.deployment === "ghes") {
        return ensure(
          false,
          "Agentic workflows are not assumed enabled on GHES by default",
          "deployment-capability-gap",
          "Document GHES-specific enablement or provide a fallback path."
        );
      }
      const next = cloneState(state);
      next.flags.sawAgenticIntro = true;
      return { ok: true, state: deepFreeze(next) };
    },
    "06-install-gh-aw": (state) => {
      if (!state.installed.gh) {
        return ensure(
          false,
          "gh CLI is not installed",
          "gh-missing",
          "Install GitHub CLI before running `gh extension install` or `gh aw` commands."
        );
      }
      const next = cloneState(state);
      next.installed.aw = "latest";
      return { ok: true, state: deepFreeze(next) };
    },
    "07-first-workflow": (state) => {
      const precheck = ensure(
        Boolean(state.installed.aw),
        "gh-aw CLI is not installed",
        "aw-missing",
        "Install gh-aw before creating the first agentic workflow."
      );
      if (!precheck.ok) return precheck;
      const next = cloneState(state);
      next.flags.hasWorkflowFile = true;
      return { ok: true, state: deepFreeze(next) };
    },
    "08-run-workflow": (state) => {
      const workflowCheck = ensure(
        state.flags.hasWorkflowFile,
        "No workflow file exists to execute",
        "workflow-missing",
        "Generate the workflow file before trying to run it."
      );
      if (!workflowCheck.ok) return workflowCheck;

      const authCheck = ensure(
        state.auth.isLoggedIn,
        "Cannot run workflow operations without GitHub authentication",
        "github-auth-missing",
        "Run `gh auth login` before triggering workflow runs."
      );
      if (!authCheck.ok) return authCheck;

      const next = cloneState(state);
      next.flags.ranWorkflow = true;
      return { ok: true, state: deepFreeze(next) };
    },
    "09-understand-output": (state) =>
      ensure(
        state.flags.ranWorkflow,
        "No workflow execution output is available",
        "output-missing",
        "Run the workflow once before the output-reading step."
      ),
    "10-design": (state) =>
      ensure(
        state.flags.sawAgenticIntro,
        "Design step reached before agentic concepts were established",
        "concept-prerequisite-missing",
        "Ensure agentic-intro step completes before design activities."
      ),
    "11-build": (state) =>
      ensure(
        state.flags.hasWorkflowFile,
        "Build step reached without an existing workflow draft",
        "workflow-missing",
        "Create a starter workflow before build refinement."
      ),
    "12-test-iterate": (state) =>
      ensure(
        state.flags.ranWorkflow,
        "Cannot iterate without an executed workflow run",
        "test-prerequisite-missing",
        "Execute at least one workflow run before test-and-iterate."
      ),
    "13-schedule": (state) =>
      ensure(
        state.auth.accountType === "enterprise-managed" || state.auth.accountType === "personal",
        "Unknown account type for scheduling assumptions",
        "account-type-unknown",
        "Set account type to personal or enterprise-managed before schedule checks."
      ),
    "14-next-steps": (state) => ({ ok: true, state })
  };
}

function replayWorkshop({ student, date, initialState, steps = STEP_IDS }) {
  const dayOfYear = toDayOfYear(date);
  const transitions = buildTransitions();
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

function simulateStudents(students, date) {
  return students.map((student) => ({
    studentId: student.id,
    name: student.name,
    result: replayWorkshop({ student, date })
  }));
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--students") args.studentsPath = argv[++i];
    else if (arg === "--date") args.date = argv[++i];
    else if (arg === "--out") args.outPath = argv[++i];
  }
  return args;
}

function runCli() {
  const fs = require("node:fs");
  const path = require("node:path");
  const { studentsPath, date, outPath } = parseArgs(process.argv);
  if (!studentsPath) {
    throw new Error("Missing required --students <path> argument.");
  }

  const today = date || new Date().toISOString().slice(0, 10);
  const raw = JSON.parse(fs.readFileSync(studentsPath, "utf8"));
  const students = Array.isArray(raw) ? raw : raw.students;
  if (!Array.isArray(students)) {
    throw new Error("Input JSON must be an array or contain a 'students' array.");
  }

  const results = {
    date: today,
    total: students.length,
    results: simulateStudents(students, today)
  };

  const output = JSON.stringify(results, null, 2);
  if (outPath) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, output);
  } else {
    process.stdout.write(`${output}\n`);
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  STEP_IDS,
  defaultEnvironmentForStudent,
  replayWorkshop,
  simulateStudents
};
