"use strict";

const { VALID_TERMINALS, ensure } = require("./simulator");

const LEVEL_BASELINE = {
  beginner: 0.38,
  "github-basic": 0.58,
  "actions-user": 0.76,
  advanced: 0.88
};

const BACKGROUND_FACTORS = {
  "no-coding": { terminal: -0.22, workflow: -0.14, concepts: -0.1, enterprise: -0.04 },
  "web-dev": { terminal: 0.02, workflow: 0.06, concepts: 0.04, enterprise: -0.02 },
  "backend-dev": { terminal: 0.08, workflow: 0.08, concepts: 0.02, enterprise: 0 },
  devops: { terminal: 0.14, workflow: 0.12, concepts: 0.04, enterprise: 0.08 },
  "data-science": { terminal: 0.01, workflow: 0, concepts: 0.06, enterprise: -0.02 },
  "enterprise-dev": { terminal: 0.06, workflow: 0.06, concepts: 0.03, enterprise: 0.12 },
  "enterprise-devops": { terminal: 0.16, workflow: 0.14, concepts: 0.04, enterprise: 0.16 },
  "program-manager": { terminal: -0.22, workflow: -0.08, concepts: 0.03, enterprise: 0.03 }
};

const STEP_FILE_ALIASES = {
  "00-welcome": ["00-welcome.md"],
  "01-prerequisites": ["01-prerequisites.md"],
  "02-setup": ["02a-setup-codespace.md", "02b-setup-local.md"],
  "03-create-your-repo": ["03-create-your-repo.md", "03a-create-your-repo-terminal.md", "03b-create-your-repo-ui.md"],
  "04-actions-intro": ["04-github-actions-intro.md"],
  "05-agentic-intro": ["05-agentic-workflows-intro.md"],
  "06-install-gh-aw": ["06-install-gh-aw.md"],
  "07-first-workflow": ["07-your-first-workflow.md", "07a-your-first-workflow-terminal.md", "07b-your-first-workflow-ui.md"],
  "08-run-workflow": ["08-run-your-workflow.md"],
  "09-understand-output": ["09-understand-output.md"],
  "10-design": ["10-choose-your-scenario.md", "10a-design-daily-status.md", "10b-design-daily-docs.md", "10c-design-pr-reviewer.md"],
  "11-build": [
    "11a-build-daily-status.md",
    "11a-build-daily-status-terminal.md",
    "11a-build-daily-status-ui.md",
    "11a-build-daily-status-wizard.md",
    "11b-build-daily-docs.md",
    "11b-build-daily-docs-terminal.md",
    "11b-build-daily-docs-ui.md",
    "11c-build-pr-reviewer.md",
    "11c-build-pr-reviewer-terminal.md",
    "11c-build-pr-reviewer-ui.md",
    "11d-build-copilot-agents.md"
  ],
  "12-test-iterate": ["12-test-and-iterate.md"],
  "13-schedule": ["13-schedule-it.md", "13a-schedule-it-terminal.md", "13b-schedule-it-ui.md"],
  "14-next-steps": ["14-next-steps.md"]
};

const STEP_IDS = [
  "00-welcome",
  "01-prerequisites",
  "02-setup",
  // Keep this ID aligned with the Step 3 landing page and its path variants.
  "03-create-your-repo",
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

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function deepFreeze(obj) {
  if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.values(obj).forEach((value) => deepFreeze(value));
  }
  return obj;
}

function isOrgScopedCodespacesToken(state) {
  return state.workspace?.context === "codespaces" && state.auth?.tokenScope === "org";
}

function isCodespacesWorkspace(state) {
  return state.workspace?.context === "codespaces";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hashText(value) {
  const text = String(value || "");
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 33 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function deterministicRoll(context, salt = 0) {
  const studentId = Number(context.student?.id || context.student?.studentId || 0);
  const runIndex = Number(context.runIndex || 0);
  const stepHash = hashText(context.stepId) + hashText(JSON.stringify(context.stepContent || {}));
  const seed = studentId * 101 + runIndex * 37 + stepHash + salt;
  return ((seed % 1000) + 1000) % 1000 / 1000;
}

function learnerProfile(state) {
  return state.learner || {};
}

function contentSignal(context, key) {
  return Number(context.stepContent?.[key] || 0);
}

function agentInsight(context) {
  const insight = context.stepContent?.agentInsight;
  return insight && typeof insight === "object" ? insight : {};
}

function ensurePlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function prefersBrowserPath(state, context) {
  const learner = learnerProfile(state);
  return (
    learner.uiPreferred === true ||
    state.tool === "CCA" ||
    state.tool === "mobile" ||
    contentSignal(context, "browserSupport") >= contentSignal(context, "terminalDemand")
  );
}

function usesTerminalPath(state, context) {
  return !prefersBrowserPath(state, context);
}

// CCA = Copilot coding agent, used here for browser-based compile-and-commit flows.
function canUseCCACompiler(state) {
  return Boolean(state.tool === "CCA" && state.auth?.hasGithubSession && state.auth?.hasCopilotAccess);
}

function canCompileWorkflow(state, context, options = {}) {
  return usesTerminalPath(state, context) || (options.allowCloudAgent && canUseCCACompiler(state));
}

function updateWorkflowCompileState(state, context, options = {}) {
  const next = cloneState(state);
  const workflowReadyToRun = canCompileWorkflow(state, context, options);
  next.flags.hasWorkflowFile = true;
  next.flags.hasCompiledWorkflowLock = workflowReadyToRun;
  next.flags.workflowReadyToRun = workflowReadyToRun;
  return next;
}

function ensureCompiledWorkflow(state, category, remediation) {
  return ensure(
    state.flags.hasWorkflowFile && state.flags.workflowReadyToRun,
    "The learner has a workflow `.md` file, but the matching `.lock.yml` is not ready for GitHub Actions to run.",
    category,
    remediation
  );
}

function computeSuccessProbability(state, context, emphasis = {}) {
  const learner = learnerProfile(state);
  const background = BACKGROUND_FACTORS[learner.background] || {};
  const terminalDemand = contentSignal(context, "terminalDemand");
  const browserSupport = contentSignal(context, "browserSupport");
  const authDemand = contentSignal(context, "authDemand");
  const complexity = contentSignal(context, "complexity");
  const troubleshootingSupport = contentSignal(context, "troubleshootingSupport");
  const conceptDemand = contentSignal(context, "conceptDemand");
  const enterpriseDemand = contentSignal(context, "enterpriseDemand");
  const mastery = learner.mastery || {};

  let probability = LEVEL_BASELINE[learner.level] ?? 0.52;
  probability += 0.14;
  probability += (learner.confidence ?? 0.5) * 0.18;
  probability += (learner.priorSuccessRate ?? 0) * 0.12;
  probability += Math.min(Number(learner.priorRuns || 0), 1500) / 1500 * 0.05;

  probability -= complexity * (emphasis.complexityWeight ?? 0.16);
  probability -= terminalDemand * (emphasis.terminalWeight ?? 0.14);
  probability -= authDemand * (emphasis.authWeight ?? 0.08);
  probability -= conceptDemand * (emphasis.conceptWeight ?? 0.1);
  probability -= enterpriseDemand * (emphasis.enterpriseWeight ?? 0.06);

  probability += (mastery.terminal ?? 0.5) * terminalDemand * 0.18;
  probability += (mastery.github ?? 0.5) * browserSupport * 0.12;
  probability += (mastery.actions ?? 0.5) * authDemand * 0.1;
  probability += (mastery.agentic ?? 0.5) * conceptDemand * 0.12;
  probability += (mastery.troubleshooting ?? 0.5) * troubleshootingSupport * 0.08;

  probability += (background.terminal || 0) * terminalDemand;
  probability += (background.workflow || 0) * conceptDemand;
  probability += (background.concepts || 0) * conceptDemand;
  probability += (background.enterprise || 0) * enterpriseDemand;

  if (learner.personality === "methodical") {
    probability += complexity * 0.08 + troubleshootingSupport * 0.1;
  } else if (learner.personality === "curious") {
    probability += conceptDemand * 0.06 + browserSupport * 0.04;
  } else if (learner.personality === "impatient") {
    probability -= complexity * 0.12 + authDemand * 0.1 + terminalDemand * 0.06;
  } else if (learner.personality === "confused") {
    probability -= conceptDemand * 0.14 + terminalDemand * 0.1 + authDemand * 0.08;
  } else if (learner.personality === "skeptical") {
    probability -= conceptDemand * 0.04;
    probability += troubleshootingSupport * 0.06;
  }

  if (learner.goal === "teaching-others") {
    probability += 0.05;
  } else if (learner.goal === "team-evaluation") {
    probability -= complexity * 0.05;
  }

  if (learner.uiPreferred) {
    probability += browserSupport * 0.08;
    probability -= Math.max(0, terminalDemand - browserSupport) * 0.16;
  }

  if (state.tool === "cli") {
    probability += terminalDemand * 0.05;
  } else if (state.tool === "vscode") {
    probability += browserSupport * 0.03;
  } else if (state.tool === "CCA") {
    probability += browserSupport * 0.12;
    probability -= terminalDemand * 0.02;
  } else if (state.tool === "mobile") {
    probability -= terminalDemand * 0.34 + complexity * 0.1;
  }

  return clamp(probability + (emphasis.bias || 0), 0.12, 0.985);
}

function evaluateStepProbability(state, context, options = {}) {
  const insight = agentInsight(context);
  const signalAdjustments = ensurePlainObject(insight.signalAdjustments);
  const pathAdjustments = ensurePlainObject(insight.pathAdjustments);
  const usingBrowserPath = prefersBrowserPath(state, context);
  const emphasis = {
    ...(options.emphasis || {}),
    bias: (options.emphasis?.bias || 0) + Number(insight.bias || 0)
  };
  let probability = computeSuccessProbability(state, context, emphasis);

  for (const signal of [
    "complexity",
    "terminalDemand",
    "browserSupport",
    "authDemand",
    "troubleshootingSupport",
    "conceptDemand",
    "enterpriseDemand"
  ]) {
    probability += contentSignal(context, signal) * Number(signalAdjustments[signal] || 0);
  }

  if (usingBrowserPath) {
    probability += Number(pathAdjustments.browser || 0);
  } else {
    probability += Number(pathAdjustments.cli || 0);
  }
  if (state.workspace?.context === "codespaces") {
    probability += Number(pathAdjustments.codespaces || 0);
  } else {
    probability += Number(pathAdjustments.local || 0);
  }
  if (state.tool === "mobile") {
    probability += Number(pathAdjustments.mobile || 0);
  }
  if (learnerProfile(state).uiPreferred) {
    probability += Number(pathAdjustments.uiPreferred || 0);
  }
  if (state.auth?.accountType === "enterprise-managed" || state.github?.deployment === "ghes") {
    probability += Number(pathAdjustments.enterprise || 0);
  }

  return {
    probability: clamp(probability, 0.12, 0.985),
    summary: typeof insight.summary === "string" ? insight.summary : "",
    riskTags: Array.isArray(insight.riskTags) ? insight.riskTags : []
  };
}

function applyLearning(state, context, gains = {}) {
  const next = cloneState(state);
  const learner = next.learner || {};
  const mastery = learner.mastery || {};
  const complexity = contentSignal(context, "complexity");
  const terminalDemand = contentSignal(context, "terminalDemand");
  const browserSupport = contentSignal(context, "browserSupport");
  const authDemand = contentSignal(context, "authDemand");
  const conceptDemand = contentSignal(context, "conceptDemand");

  learner.confidence = clamp(
    (learner.confidence ?? 0.5) + 0.02 + (gains.confidence || 0) + Math.max(0, 0.04 - complexity * 0.02),
    0.08,
    0.99
  );
  mastery.terminal = clamp((mastery.terminal ?? 0.5) + terminalDemand * 0.05 + (gains.terminal || 0), 0, 1);
  mastery.github = clamp((mastery.github ?? 0.5) + browserSupport * 0.04 + (gains.github || 0), 0, 1);
  mastery.actions = clamp((mastery.actions ?? 0.5) + authDemand * 0.04 + (gains.actions || 0), 0, 1);
  mastery.agentic = clamp((mastery.agentic ?? 0.5) + conceptDemand * 0.05 + (gains.agentic || 0), 0, 1);
  mastery.troubleshooting = clamp(
    (mastery.troubleshooting ?? 0.5) + contentSignal(context, "troubleshootingSupport") * 0.04 + (gains.troubleshooting || 0),
    0,
    1
  );
  learner.mastery = mastery;
  next.learner = learner;
  return deepFreeze(next);
}

function contentReadinessCheck(state, context, options = {}) {
  const assessment = evaluateStepProbability(state, context, options);
  const { probability, ...assessmentMeta } = assessment;
  if (deterministicRoll(context, options.salt || 0) <= assessment.probability) {
    return { ok: true, probability, assessment: assessmentMeta };
  }
  const failure = ensure(
    false,
    options.failedAssumption || "The learner misses a key instruction in this step.",
    options.category || "content-friction",
    options.remediation || "Reduce the cognitive load in this step or add a clearer UI/CLI split."
  );
  failure.probability = probability;
  failure.assessment = assessmentMeta;
  return failure;
}

function buildTransitions() {
  return {
    "00-welcome": (state, context) => ({ ok: true, state: applyLearning(state, context, { confidence: 0.01 }) }),
    "01-prerequisites": (state, context) => {
      const metadataCheck = ensure(
        Boolean(state.os && state.terminal && state.auth && state.github),
        "Missing base environment metadata (os/terminal/auth/deployment)",
        "environment-metadata-missing",
        "Initialize environment with os, terminal, auth, and deployment fields before replay."
      );
      if (!metadataCheck.ok) return metadataCheck;
      return { ok: true, state: applyLearning(state, context, { github: 0.02, confidence: 0.01 }) };
    },
    "02-setup": (state, context) => {
      if (state.tool === "mobile") {
        return ensure(
          false,
          "The setup step assumes access to a desktop-class browser or terminal, which the mobile-only path cannot provide.",
          "mobile-terminal-gap",
          "Explicitly direct mobile learners to switch to a laptop/desktop and open a Codespace before continuing."
        );
      }
      const terminalCheck = ensure(
        VALID_TERMINALS[state.os] && VALID_TERMINALS[state.os].has(state.terminal),
        `Terminal '${state.terminal}' is not valid for OS '${state.os}'`,
        "terminal-os-mismatch",
        "Use bash/zsh for macOS/Linux and powershell/cmd for Windows."
      );
      if (!terminalCheck.ok) return terminalCheck;
      const readiness = contentReadinessCheck(state, context, {
        salt: 29,
        category: "setup-friction",
        failedAssumption: "The learner cannot translate the chosen setup path into a ready-to-use terminal environment.",
        remediation: "Shorten the setup path, surface the terminal expectation earlier, and keep browser-first recovery steps nearby.",
        emphasis: { bias: 0.3, terminalWeight: 0.16, complexityWeight: 0.12 }
      });
      if (!readiness.ok) return readiness;
      const next = cloneState(state);
      if (!next.installed.gh) {
        next.installed.gh = "2.58.0";
      }
      next.flags.environmentReady = true;
      // Codespace setup opens the ready-to-use environment, but the learner does not
      // create their practice repository until Step 03. The local path creates that
      // repository during setup, so those repo flags are available earlier.
      if (!isCodespacesWorkspace(state)) {
        next.flags.hasRepo = true;
        next.flags.repoCreatedViaUi = true;
        next.flags.repoHasReadme = true;
      }
      return { ok: true, state: applyLearning(next, context, { terminal: 0.08, github: 0.03 }) };
    },
    "03-create-your-repo": (state, context) => {
      const environmentReadyCheck = ensure(
        state.flags.environmentReady,
        "Practice repository setup requires a local terminal or Codespace to be ready",
        "environment-not-ready",
        "Complete Adventure A (Codespace) or Adventure B (local terminal) before creating `my-agentic-workflows`."
      );
      if (!environmentReadyCheck.ok) return environmentReadyCheck;
      const needsRepoCreation = !state.flags.hasRepo;
      if (!needsRepoCreation) {
        const readmeCheck = ensure(
          state.flags.repoHasReadme,
          "Practice repository is missing the starter README",
          "repo-readme-missing",
          "Enable 'Add a README file' when creating the repository in GitHub UI."
        );
        if (!readmeCheck.ok) return readmeCheck;
      }
      const readiness = contentReadinessCheck(state, context, {
        salt: 43,
        category: "repo-creation-friction",
        failedAssumption: "The learner struggles to connect the browser repo-creation flow with the terminal/browser path they chose.",
        remediation: "Tighten the path-specific repo-opening instructions and keep the UI-vs-terminal split visible.",
        emphasis: { bias: 0.18 }
      });
      if (!readiness.ok) return readiness;
      const next = cloneState(state);
      if (needsRepoCreation) {
        next.flags.hasRepo = true;
        next.flags.repoCreatedViaUi = true;
        next.flags.repoHasReadme = true;
      }
      next.flags.repoVerified = true;
      return { ok: true, state: applyLearning(next, context, { github: 0.06, confidence: 0.02 }) };
    },
    "04-actions-intro": (state, context) => {
      const readiness = contentReadinessCheck(state, context, {
        salt: 59,
        category: "concept-overload",
        failedAssumption: "The learner skims the Actions explanation and reaches later steps without a stable mental model.",
        remediation: "Trim conceptual load or add a simpler visual summary before asking the learner to apply Actions concepts.",
        emphasis: { conceptWeight: 0.14, bias: 0.12 }
      });
      if (!readiness.ok) return readiness;
      const next = cloneState(state);
      next.flags.sawActionsIntro = true;
      return { ok: true, state: applyLearning(next, context, { actions: 0.08, agentic: 0.02 }) };
    },
    "05-agentic-intro": (state, context) => {
      if (state.github.deployment === "ghes") {
        return ensure(
          false,
          "The workshop content treats GHES support as conditional, so GHES learners still face an enablement gap before the first agentic step.",
          "deployment-capability-gap",
          "Add a clearer GHES branch with enablement checks or a hosted fallback path before the first agentic workflow exercise."
        );
      }
      const readiness = contentReadinessCheck(state, context, {
        salt: 73,
        category: "agentic-concept-gap",
        failedAssumption: "The learner does not fully internalize the shift from deterministic jobs to goal-oriented agentic workflows.",
        remediation: "Add a shorter before/after example or a more explicit summary of what changes from classic Actions.",
        emphasis: { conceptWeight: 0.16, bias: 0.08 }
      });
      if (!readiness.ok) return readiness;
      const next = cloneState(state);
      next.flags.sawAgenticIntro = true;
      return { ok: true, state: applyLearning(next, context, { agentic: 0.1, actions: 0.03 }) };
    },
    "06-install-gh-aw": (state, context) => {
      const envCheck = ensure(
        state.flags.environmentReady,
        "gh-aw cannot be installed before setup opens a Codespace or local terminal",
        "environment-not-ready",
        "Complete the setup step (02-setup) before installing the gh-aw extension."
      );
      if (!envCheck.ok) return envCheck;
      if (!state.installed.gh) {
        return ensure(
          false,
          "gh CLI is not installed",
          "gh-missing",
          "Install GitHub CLI before running `gh extension install` or `gh aw` commands."
        );
      }
      const readiness = contentReadinessCheck(state, context, {
        salt: 97,
        category: "extension-install-friction",
        failedAssumption: "The learner hits install friction around authentication, token scope, or path switching and does not recover.",
        remediation: "Keep the 403 fallback, Codespace detour, and auth pre-flight more visible before the install command.",
        emphasis: { bias: 0.14, terminalWeight: 0.16, authWeight: 0.1, complexityWeight: 0.12 }
      });
      if (!readiness.ok) return readiness;
      const next = cloneState(state);
      next.installed.aw = "latest";
      next.flags.awSkillInitialized = true;
      next.flags.awSkillPushed = true;
      return { ok: true, state: applyLearning(next, context, { terminal: 0.06, agentic: 0.05, troubleshooting: 0.04 }) };
    },
    "07-first-workflow": (state, context) => {
      if (state.tool === "mobile") {
        return ensure(
          false,
          "GitHub Mobile cannot realistically create and edit the workflow file used in this step.",
          "mobile-authoring-gap",
          "Tell mobile learners to switch to a desktop browser, Codespace, or VS Code before the first workflow-authoring step."
        );
      }
      const precheck = ensure(
        Boolean(state.installed.aw),
        "gh-aw CLI is not installed",
        "aw-missing",
        "Install gh-aw before creating the first agentic workflow."
      );
      if (!precheck.ok) return precheck;
      const initCheck = ensure(
        state.flags.awSkillInitialized && state.flags.awSkillPushed,
        "The required agentic workflow skill is missing because `gh aw init` was not completed and pushed before authoring.",
        "aw-init-missing",
        "Run `gh aw init` in your repository root, commit the generated `.github/skills/agentic-workflows/` files, and push before creating the first workflow."
      );
      if (!initCheck.ok) return initCheck;
      const readiness = contentReadinessCheck(state, context, {
        salt: 113,
        category: "workflow-authoring-friction",
        failedAssumption: "The learner struggles to translate the tutorial into a valid first workflow file.",
        remediation: "Reduce frontmatter editing load and make the UI-only and terminal authoring paths easier to compare.",
        emphasis: { bias: 0.14, terminalWeight: 0.16, conceptWeight: 0.12, complexityWeight: 0.12 }
      });
      if (!readiness.ok) return readiness;
      const next = updateWorkflowCompileState(state, context, { allowCloudAgent: true });
      return { ok: true, state: applyLearning(next, context, { agentic: 0.08, terminal: 0.04, github: 0.03 }) };
    },
    "08-run-workflow": (state, context) => {
      const workflowCheck = ensure(
        state.flags.hasWorkflowFile,
        "No workflow file exists to execute",
        "workflow-missing",
        "Generate the workflow file before trying to run it."
      );
      if (!workflowCheck.ok) return workflowCheck;
      const compiledWorkflowCheck = ensureCompiledWorkflow(
        state,
        "workflow-not-compiled",
        "Compile the workflow with `gh aw compile` in a terminal, or run the compiler in a Copilot coding agent (CCA) session before running the workflow. Pushing the `.md` file alone does not create the `.lock.yml` that GitHub Actions runs."
      );
      if (!compiledWorkflowCheck.ok) return compiledWorkflowCheck;

      const usingBrowserPath = prefersBrowserPath(state, context);
      const authCheck = ensure(
        usingBrowserPath ? state.auth.hasGithubSession : state.auth.isLoggedIn,
        usingBrowserPath
          ? "The browser/UI path still requires the learner to be signed in on GitHub."
          : "Cannot run workflow operations without GitHub CLI authentication",
        "github-auth-missing",
        usingBrowserPath
          ? "Confirm the learner is signed in on GitHub.com before using the Actions tab run path."
          : "Run `gh auth status` first (Codespaces sessions are often pre-authenticated); if needed, run `gh auth login` before triggering workflow runs."
      );
      if (!authCheck.ok) return authCheck;

      const copilotCheck = ensure(
        state.auth.hasCopilotAccess,
        "The workflow can be triggered, but the account does not appear to have usable Copilot model access for the run.",
        "copilot-access-missing",
        "Complete the Copilot access check before running the workflow, or add a clearer fallback for accounts without model access."
      );
      if (!copilotCheck.ok) return copilotCheck;

      if (!usingBrowserPath && state.workspace?.context === "codespaces" && state.auth?.tokenScope === "org") {
        return ensure(
          false,
          "The terminal-trigger path in Codespaces can still fail when the org-scoped token lacks workflow trigger permissions.",
          "codespaces-actions-write-gap",
          "Prefer the Actions-tab UI trigger for Codespaces learners, or surface the `actions:write` recovery side quest earlier."
        );
      }

      if (
        state.actions?.inferenceProvider === "github" &&
        state.github?.repositoryOwnerType === "organization" &&
        state.actions?.secrets?.COPILOT_GITHUB_TOKEN !== true
      ) {
        return ensure(
          false,
          "Regular organization-owned repositories cannot rely on `permissions.copilot-requests: write` alone for GitHub inference.",
          "org-repo-copilot-token-required",
          "Use Method 2 and add `COPILOT_GITHUB_TOKEN`, while keeping `permissions.copilot-requests: write` in the workflow frontmatter."
        );
      }

      if (!usingBrowserPath && state.actions?.permissions?.copilotRequestsWrite !== true) {
        if (state.auth?.accountType === "enterprise-managed") {
          return ensure(
            false,
            "Enterprise GitHub inference requires `permissions.copilot-requests: write` to enable org billing.",
            "org-billing-not-enabled",
            "Set `permissions.copilot-requests: write` for enterprise workflows that use GitHub inference."
          );
        }
        return ensure(
          false,
          "Workflow is missing `permissions.copilot-requests: write` for GitHub inference.",
          "copilot-permission-missing",
          "Add `permissions.copilot-requests: write` to the workflow frontmatter."
        );
      }

      const readiness = contentReadinessCheck(state, context, {
        salt: usingBrowserPath ? 131 : 149,
        category: usingBrowserPath ? "ui-run-guidance-gap" : "cli-run-guidance-gap",
        failedAssumption: usingBrowserPath
          ? "The learner misses one of the Actions-tab run steps even though the browser path avoids local token setup."
          : "The learner chooses the terminal trigger path and gets blocked by auth or trigger-scope friction.",
        remediation: usingBrowserPath
          ? "Keep the browser-first trigger path prominent and reduce the amount of adjacent advanced CLI detail."
          : "Push the CLI trigger into a more clearly optional path and keep Codespaces token caveats attached to it.",
        emphasis: usingBrowserPath
          ? { terminalWeight: 0.04, authWeight: 0.08, complexityWeight: 0.12, bias: 0.16 }
          : { bias: 0.02, terminalWeight: 0.14, authWeight: 0.14, complexityWeight: 0.12 }
      });
      if (!readiness.ok) return readiness;

      const next = cloneState(state);
      next.flags.ranWorkflow = true;
      return { ok: true, state: applyLearning(next, context, { actions: 0.06, github: 0.04, confidence: 0.03 }) };
    },
    "09-understand-output": (state, context) => {
      const outputCheck = ensure(
        state.flags.ranWorkflow,
        "No workflow execution output is available",
        "output-missing",
        "Run the workflow once before the output-reading step."
      );
      if (!outputCheck.ok) return outputCheck;
      const readiness = contentReadinessCheck(state, context, {
        salt: 167,
        category: "output-interpretation-gap",
        failedAssumption: "The learner sees the logs but cannot map reasoning steps, tool calls, and outcomes back to the workflow.",
        remediation: "Add a shorter annotated example of the run log and explain the meaning of each line more directly.",
        emphasis: { bias: 0.12 }
      });
      if (!readiness.ok) return readiness;
      return { ok: true, state: applyLearning(state, context, { agentic: 0.05, actions: 0.03 }) };
    },
    "10-design": (state, context) => {
      const prerequisiteCheck = ensure(
        state.flags.sawAgenticIntro,
        "Design step reached before agentic concepts were established",
        "concept-prerequisite-missing",
        "Ensure agentic-intro step completes before design activities."
      );
      if (!prerequisiteCheck.ok) return prerequisiteCheck;
      const readiness = contentReadinessCheck(state, context, {
        salt: 181,
        category: "design-choice-overload",
        failedAssumption: "The learner cannot confidently choose a scenario or turn ideas into a scoped workflow plan.",
        remediation: "Narrow the decision space or provide stronger starter templates for each scenario.",
        emphasis: { bias: 0.08 }
      });
      if (!readiness.ok) return readiness;
      return { ok: true, state: applyLearning(state, context, { agentic: 0.08, confidence: 0.02 }) };
    },
    "11-build": (state, context) => {
      const workflowCheck = ensure(
        state.flags.hasWorkflowFile,
        "Build step reached without an existing workflow draft",
        "workflow-missing",
        "Create a starter workflow before build refinement."
      );
      if (!workflowCheck.ok) return workflowCheck;
      const readiness = contentReadinessCheck(state, context, {
        salt: 193,
        category: "build-iteration-friction",
        failedAssumption: "The learner cannot keep the workflow, prompt, and compile/test loop aligned while building.",
        remediation: "Break the build step into smaller checkpoints and reinforce `gh aw compile --watch` earlier.",
        emphasis: { bias: 0.08 }
      });
      if (!readiness.ok) return readiness;
      const next = updateWorkflowCompileState(state, context, { allowCloudAgent: true });
      return { ok: true, state: applyLearning(next, context, { agentic: 0.1, terminal: 0.05, troubleshooting: 0.05 }) };
    },
    "12-test-iterate": (state, context) => {
      const compiledWorkflowCheck = ensureCompiledWorkflow(
        state,
        "workflow-not-compiled",
        "Compile the scenario workflow with `gh aw compile`, or use a CCA session that compiles the edited `.md` into `.lock.yml`, before trying to run it from Step 12."
      );
      if (!compiledWorkflowCheck.ok) return compiledWorkflowCheck;
      const runCheck = ensure(
        state.flags.ranWorkflow,
        "Cannot iterate without an executed workflow run",
        "test-prerequisite-missing",
        "Execute at least one workflow run before test-and-iterate."
      );
      if (!runCheck.ok) return runCheck;
      const readiness = contentReadinessCheck(state, context, {
        salt: 211,
        category: "test-iterate-friction",
        failedAssumption: "The learner does not know how to turn runtime feedback into the next workflow revision.",
        remediation: "Add a tighter observe-refine loop with one concrete example of a change prompted by run output.",
        emphasis: { bias: 0.1 }
      });
      if (!readiness.ok) return readiness;
      const next = updateWorkflowCompileState(state, context, { allowCloudAgent: true });
      return { ok: true, state: applyLearning(next, context, { troubleshooting: 0.08, agentic: 0.05 }) };
    },
    "13-schedule": (state, context) => {
      const compiledWorkflowCheck = ensureCompiledWorkflow(
        state,
        "workflow-not-compiled",
        "Compile the latest workflow source before changing or verifying the schedule. GitHub does not compile a pushed `.md` file into `.lock.yml` automatically."
      );
      if (!compiledWorkflowCheck.ok) return compiledWorkflowCheck;
      const accountCheck = ensure(
        state.auth.accountType === "enterprise-managed" || state.auth.accountType === "personal",
        "Unknown account type for scheduling assumptions",
        "account-type-unknown",
        "Set account type to personal or enterprise-managed before schedule checks."
      );
      if (!accountCheck.ok) return accountCheck;
      const readiness = contentReadinessCheck(state, context, {
        salt: 227,
        category: "schedule-friction",
        failedAssumption: "The learner gets tripped up by schedule syntax or by the compile-and-confirm loop around scheduling.",
        remediation: "Keep the fuzzy-schedule examples close to the edit step and make the compile checkpoint more explicit.",
        emphasis: { bias: 0.12 }
      });
      if (!readiness.ok) return readiness;
      const next = updateWorkflowCompileState(state, context, { allowCloudAgent: true });
      return { ok: true, state: applyLearning(next, context, { actions: 0.05, agentic: 0.04 }) };
    },
    "14-next-steps": (state, context) => ({ ok: true, state: applyLearning(state, context, { confidence: 0.01 }) })
  };
}

module.exports = {
  STEP_IDS,
  steps: STEP_IDS,
  stepFilesById: STEP_FILE_ALIASES,
  transitions: buildTransitions(),
  buildTransitions
};
