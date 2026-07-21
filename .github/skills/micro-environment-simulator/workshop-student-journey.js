"use strict";

const { VALID_TERMINALS, ensure } = require("./simulator");

const MODEL_VERSION = "2026-07-survival-model-v2";

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
  "04-actions-intro": ["04-github-actions-intro.md"],
  "05-agentic-intro": ["05-agentic-workflows-intro.md"],
  "06-install-gh-aw": [
    "06-install-gh-aw.md",
    "06a-install-terminal.md",
    "06b-install-local.md",
    "06c-install-ui.md"
  ],
  "07-first-workflow": [
    "07-your-first-workflow.md",
    "07a-your-first-workflow-terminal.md",
    "07a-part2-your-first-workflow-instructions.md",
    "07c-your-first-workflow-copilot.md",
    "07d-confirm-model-access.md"
  ],
  "08-run-your-workflow": ["08-run-your-workflow.md"],
  "08b-interpret-your-run": ["08b-interpret-your-run.md"],
  "09-agentic-editing": ["09-agentic-editing.md"],
  "12-test-and-iterate": ["12-test-and-iterate.md"],
  "14-next-steps": ["14-next-steps.md"],
  "15-conditional-logic": ["15-conditional-logic.md"],
  "16-connect-data-source": ["16-connect-data-source.md"],
  "17-add-mcp-tools": ["17-add-mcp-tools.md"],
  "18-share-and-reuse": ["18-share-and-reuse.md"],
  "19-research-driven-training-node": ["19-research-driven-training-node.md"],
  "20-persistent-memory": ["20-persistent-memory.md"],
  "21-inline-sub-agents": ["21-inline-sub-agents.md"],
  "22-error-handling-and-resilience": ["22-error-handling-and-resilience.md"],
  "23-ab-experiments": ["23-ab-experiments.md"],
  "24-self-hosted-runners": ["24-self-hosted-runners.md"],
  "25-audit-and-observability": ["25-audit-and-observability.md"],
  "26-manage-costs-and-budgets": ["26-manage-costs-and-budgets.md"]
};

const STEP_IDS = [
  "00-welcome",
  "01-prerequisites",
  "02-setup",
  "04-actions-intro",
  "05-agentic-intro",
  "06-install-gh-aw",
  "07-first-workflow",
  "08-run-your-workflow",
  "08b-interpret-your-run",
  "09-agentic-editing",
  "12-test-and-iterate",
  "14-next-steps",
  "15-conditional-logic",
  "16-connect-data-source",
  "17-add-mcp-tools",
  "18-share-and-reuse",
  "19-research-driven-training-node",
  "20-persistent-memory",
  "21-inline-sub-agents",
  "22-error-handling-and-resilience",
  "23-ab-experiments",
  "24-self-hosted-runners",
  "25-audit-and-observability",
  "26-manage-costs-and-budgets"
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function simulationRoll(context) {
  return typeof context.random === "function" ? context.random() : 0.5;
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
    state.mobile === true ||
    contentSignal(context, "browserSupport") >= contentSignal(context, "terminalDemand")
  );
}

function usesTerminalPath(state, context) {
  return !prefersBrowserPath(state, context);
}

function hasAgentCompilerAuth(state) {
  return Boolean(state.auth?.hasGithubSession && state.auth?.hasCopilotAccess);
}

function canCompileWorkflow(state, context, options = {}) {
  return usesTerminalPath(state, context) || (options.allowCloudAgent && hasAgentCompilerAuth(state));
}

function needsCcaPromptGuidance(state, context) {
  return state.tool === "CCA" && prefersBrowserPath(state, context);
}

function hasCcaPromptGuidance(state, context) {
  return (
    stepMetric(state, context, "agentsPromptCueCount") > 0 &&
    stepMetric(state, context, "agenticWorkflowSkillCueCount") > 0
  );
}

function stepMetric(state, context, metric) {
  const fileSignals = Array.isArray(context.stepContent?.fileSignals) ? context.stepContent.fileSignals : [];
  if (context.stepId === "07-first-workflow" && fileSignals.length > 0) {
    const relevantFiles = prefersBrowserPath(state, context)
      ? new Set([
          "07c-your-first-workflow-copilot.md",
          "07d-confirm-model-access.md"
        ])
      : new Set([
          "07a-your-first-workflow-terminal.md",
          "07a-part2-your-first-workflow-instructions.md",
          "07d-confirm-model-access.md"
        ]);
    return fileSignals
      .filter(({ file }) => relevantFiles.has(file))
      .reduce((sum, fileSignal) => sum + Number(fileSignal?.[metric] || 0), 0);
  }
  return contentSignal(context, metric);
}

function updateWorkflowCompileState(state, context, options = {}) {
  const next = cloneState(state);
  next.flags.hasWorkflowFile = true;
  if (stepMetric(state, context, "workflowCompileCueCount") <= 0) {
    return next;
  }
  const hasCompiledWorkflowLock =
    canCompileWorkflow(state, context, options);
  const hasPushedCompiledWorkflowLock =
    hasCompiledWorkflowLock &&
    (stepMetric(state, context, "workflowLockPublishCueCount") > 0 ||
      state.flags.hasPushedCompiledWorkflowLock);
  next.flags.hasCompiledWorkflowLock = hasCompiledWorkflowLock;
  next.flags.hasPushedCompiledWorkflowLock = hasPushedCompiledWorkflowLock;
  next.flags.workflowReadyToRun = hasPushedCompiledWorkflowLock;
  return next;
}

function configureFirstWorkflowAuth(state, context) {
  const next = cloneState(state);
  if (next.actions?.inferenceProvider !== "github") {
    return next;
  }
  const usesCentralizedBilling = next.actions?.centralizedCopilotBilling === true;
  next.actions.permissions.copilotRequestsWrite =
    usesCentralizedBilling && stepMetric(state, context, "copilotRequestsWriteCueCount") > 0;
  next.actions.secrets.COPILOT_GITHUB_TOKEN =
    !usesCentralizedBilling && stepMetric(state, context, "copilotGithubTokenCueCount") > 0;
  return next;
}

function ensureCompiledWorkflow(state, category, remediation) {
  return ensure(
    state.flags.hasWorkflowFile &&
      state.flags.hasCompiledWorkflowLock &&
      state.flags.hasPushedCompiledWorkflowLock &&
      state.flags.workflowReadyToRun,
    "The learner has a workflow `.md` file, but the matching `.lock.yml` has not been compiled and pushed where GitHub Actions can run it.",
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
  probability += Number(learner.sessionEffect || 0);

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
  }
  if (state.mobile === true) {
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
  if (state.mobile === true) {
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

  const saturatingGain = (current, gain) => clamp(current + gain * (1 - current), 0, 1);
  learner.confidence = saturatingGain(
    learner.confidence ?? 0.5,
    0.02 + (gains.confidence || 0) + Math.max(0, 0.04 - complexity * 0.02)
  );
  mastery.terminal = saturatingGain(
    mastery.terminal ?? 0.5,
    terminalDemand * 0.05 + (gains.terminal || 0)
  );
  mastery.github = saturatingGain(
    mastery.github ?? 0.5,
    browserSupport * 0.04 + (gains.github || 0)
  );
  mastery.actions = saturatingGain(
    mastery.actions ?? 0.5,
    authDemand * 0.04 + (gains.actions || 0)
  );
  mastery.agentic = saturatingGain(
    mastery.agentic ?? 0.5,
    conceptDemand * 0.05 + (gains.agentic || 0)
  );
  mastery.troubleshooting = saturatingGain(
    mastery.troubleshooting ?? 0.5,
    contentSignal(context, "troubleshootingSupport") * 0.04 + (gains.troubleshooting || 0)
  );
  learner.mastery = mastery;
  next.learner = learner;
  return deepFreeze(next);
}

function markPracticeRepoCreatedAndVerified(state) {
  const next = cloneState(state);
  next.flags.hasRepo = true;
  next.flags.repoCreatedViaUi = true;
  next.flags.repoHasReadme = true;
  next.flags.repoVerified = true;
  return next;
}

function contentReadinessCheck(state, context, options = {}) {
  const assessment = evaluateStepProbability(state, context, options);
  const { probability, ...assessmentMeta } = assessment;
  if (simulationRoll(context) <= assessment.probability) {
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

function advancedLessonStep(state, context, options = {}) {
  const workflowCheck = ensure(
    state.flags.hasWorkflowFile,
    options.workflowMissingMessage || "Advanced workshop steps assume the learner already has a workflow to extend.",
    options.workflowMissingCategory || "workflow-missing",
    options.workflowMissingRemediation ||
      "Complete the first workflow path before continuing into the advanced lessons."
  );
  if (!workflowCheck.ok) return workflowCheck;

  if (options.requiresCompiledWorkflow !== false) {
    const compiledWorkflowCheck = ensureCompiledWorkflow(
      state,
      options.compiledCategory || "workflow-not-compiled",
      options.compiledRemediation ||
        "Compile the latest workflow source with `gh aw compile`, then commit and push the matching `.lock.yml` before continuing."
    );
    if (!compiledWorkflowCheck.ok) return compiledWorkflowCheck;
  }

  if (options.requiresRun === true) {
    const runCheck = ensure(
      state.flags.ranWorkflow,
      options.runMissingMessage || "This step assumes the learner has already run the workflow and seen at least one result.",
      options.runMissingCategory || "run-prerequisite-missing",
      options.runMissingRemediation ||
        "Trigger the workflow once and inspect the output before attempting this advanced change."
    );
    if (!runCheck.ok) return runCheck;
  }

  const readiness = contentReadinessCheck(state, context, {
    salt: options.salt,
    category: options.category,
    failedAssumption: options.failedAssumption,
    remediation: options.remediation,
    emphasis: options.emphasis
  });
  if (!readiness.ok) return readiness;

  let next = cloneState(state);
  if (options.recompile !== false) {
    next = updateWorkflowCompileState(next, context, { allowCloudAgent: true });
  }
  if (typeof options.mutateState === "function") {
    next = options.mutateState(next) || next;
  }
  return { ok: true, state: applyLearning(next, context, options.learningGains || {}) };
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
      if (state.mobile === true) {
        const readiness = contentReadinessCheck(state, context, {
          salt: 23,
          category: "mobile-setup-friction",
          failedAssumption: "The learner cannot complete the browser and agent setup path from a mobile device.",
          remediation: "Keep the mobile browser path explicit and offer a desktop or Codespace handoff when the device cannot complete an activity.",
          emphasis: { bias: 0.12, terminalWeight: 0, complexityWeight: 0.1 }
        });
        if (!readiness.ok) return readiness;
        const next = markPracticeRepoCreatedAndVerified(state);
        next.flags.environmentReady = true;
        return { ok: true, state: applyLearning(next, context, { github: 0.04, confidence: 0.01 }) };
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
      const next = markPracticeRepoCreatedAndVerified(state);
      if (!next.installed.gh) {
        next.installed.gh = "2.58.0";
      }
      next.flags.environmentReady = true;
      return { ok: true, state: applyLearning(next, context, { terminal: 0.08, github: 0.03 }) };
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
      const terminalPath = usesTerminalPath(state, context);
      if (terminalPath && !state.installed.gh) {
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
      if (terminalPath) {
        next.installed.aw = "latest";
        next.flags.awSkillInitialized = true;
        next.flags.awSkillPushed = true;
      }
      return { ok: true, state: applyLearning(next, context, { terminal: 0.06, agentic: 0.05, troubleshooting: 0.04 }) };
    },
    "07-first-workflow": (state, context) => {
      const repoCheck = ensure(
        state.flags.hasRepo && state.flags.repoHasReadme,
        "The learner has not prepared the practice repository that the workflow files should live in.",
        "practice-repo-missing",
        "Create `my-agentic-workflows` with a starter README during the setup step before authoring the workflow."
      );
      if (!repoCheck.ok) return repoCheck;
      const terminalPath = usesTerminalPath(state, context);
      const precheck = ensure(
        !terminalPath || Boolean(state.installed.aw),
        "gh-aw CLI is not installed",
        "aw-missing",
        "Install gh-aw before creating the first agentic workflow."
      );
      if (!precheck.ok) return precheck;
      const initCheck = ensure(
        !terminalPath || (state.flags.awSkillInitialized && state.flags.awSkillPushed),
        "The required agentic workflow skill is missing because `gh aw init` was not completed and pushed before authoring.",
        "aw-init-missing",
        "Run `gh aw init` in your repository root, commit the generated `.github/skills/agentic-workflows/` files, and push before creating the first workflow."
      );
      if (!initCheck.ok) return initCheck;
      const ccaGuidanceCheck = ensure(
        !needsCcaPromptGuidance(state, context) || hasCcaPromptGuidance(state, context),
        "The Copilot path does not clearly tell CCA learners that the Agents tab expects prompts and that they should invoke `/agentic-workflows`.",
        "copilot-skill-guidance-missing",
        "Explicitly tell CCA learners to send a prompt in the Agents tab and start workflow-authoring requests with `/agentic-workflows`."
      );
      if (!ccaGuidanceCheck.ok) return ccaGuidanceCheck;
      const readiness = contentReadinessCheck(state, context, {
        salt: 113,
        category: "workflow-authoring-friction",
        failedAssumption: "The learner struggles to translate the tutorial into a valid first workflow file.",
        remediation: "Reduce frontmatter editing load and make the UI-only and terminal authoring paths easier to compare.",
        emphasis: { bias: 0.14, terminalWeight: 0.16, conceptWeight: 0.12, complexityWeight: 0.12 }
      });
      if (!readiness.ok) return readiness;
      const copilotCheck = ensure(
        state.auth.hasCopilotAccess,
        "The learner cannot complete the required model-access activity because the selected account has no usable Copilot access.",
        "copilot-access-missing",
        "Confirm organization centralized billing or an active Copilot license before continuing to Step 8."
      );
      if (!copilotCheck.ok) return copilotCheck;
      const next = configureFirstWorkflowAuth(
        updateWorkflowCompileState(state, context, { allowCloudAgent: true }),
        context
      );
      if (!terminalPath && hasAgentCompilerAuth(state)) {
        next.flags.awSkillInitialized = true;
        next.flags.awSkillPushed = true;
      }
      return { ok: true, state: applyLearning(next, context, { agentic: 0.08, terminal: 0.04, github: 0.03 }) };
    },
    "08-run-your-workflow": (state, context) => {
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
        "Compile the workflow with `gh aw compile`, then commit and push the generated `.lock.yml`, or use a Copilot coding agent (CCA) session that compiles and commits the lock file before running the workflow. Pushing the `.md` file alone does not create the `.lock.yml` that GitHub Actions runs."
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

      if (!usingBrowserPath && state.workspace?.context === "codespaces" && state.auth?.tokenScope === "org") {
        return ensure(
          false,
          "The terminal-trigger path in Codespaces can still fail when the org-scoped token lacks workflow trigger permissions.",
          "codespaces-actions-write-gap",
          "Prefer the Actions-tab UI trigger for Codespaces learners, or surface the `actions:write` recovery side quest earlier."
        );
      }

      const modelAccessCheck = ensure(
        state.actions?.centralizedCopilotBilling === true
          ? state.actions?.permissions?.copilotRequestsWrite === true
          : state.actions?.permissions?.copilotRequestsWrite !== true &&
              state.actions?.secrets?.COPILOT_GITHUB_TOKEN === true,
        "The workflow's Copilot authentication does not match its selected billing method.",
        "model-access-not-configured",
        "Return to Step 7d, select one billing method, then recompile and commit the lock file."
      );
      if (!modelAccessCheck.ok) return modelAccessCheck;

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
          ? { terminalWeight: 0.04, authWeight: 0, complexityWeight: 0.12, bias: 0.16 }
          : { bias: 0.02, terminalWeight: 0.14, authWeight: 0, complexityWeight: 0.12 }
      });
      if (!readiness.ok) return readiness;

      const next = cloneState(state);
      next.flags.ranWorkflow = true;
      return { ok: true, state: applyLearning(next, context, { actions: 0.06, github: 0.04, confidence: 0.03 }) };
    },
    "08b-interpret-your-run": (state, context) => {
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
    "09-agentic-editing": (state, context) => {
      const runCheck = ensure(
        state.flags.ranWorkflow,
        "The workflow-editing step makes less sense before the learner has seen at least one real run.",
        "run-prerequisite-missing",
        "Run the first workflow and review its output before trying to refine it with the agentic-workflows skill."
      );
      if (!runCheck.ok) return runCheck;
      const skillCheck = ensure(
        state.flags.awSkillInitialized && state.flags.awSkillPushed,
        "The repository skill used for workflow editing is not available yet.",
        "workflow-skill-missing",
        "Complete the first workflow setup path that initializes and commits `.github/skills/agentic-workflows/` before editing."
      );
      if (!skillCheck.ok) return skillCheck;
      const readiness = contentReadinessCheck(state, context, {
        salt: 181,
        category: "workflow-editing-friction",
        failedAssumption: "The learner can describe the workflow change they want, but struggles to steer the skill or keep the compile loop aligned.",
        remediation: "Keep the edit, debug, and optimize prompt patterns concise and reinforce recompiling immediately after each change.",
        emphasis: { bias: 0.1, conceptWeight: 0.08 }
      });
      if (!readiness.ok) return readiness;
      const next = updateWorkflowCompileState(state, context, { allowCloudAgent: true });
      return { ok: true, state: applyLearning(next, context, { agentic: 0.09, troubleshooting: 0.04, confidence: 0.02 }) };
    },
    "12-test-and-iterate": (state, context) => {
      const compiledWorkflowCheck = ensureCompiledWorkflow(
        state,
        "workflow-not-compiled",
        "Compile the scenario workflow with `gh aw compile`, then commit and push the generated `.lock.yml`, or use a CCA session that compiles and commits the edited workflow before trying to run it from Step 12."
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
    "14-next-steps": (state, context) => ({ ok: true, state: applyLearning(state, context, { confidence: 0.01 }) }),
    "15-conditional-logic": (state, context) =>
      advancedLessonStep(state, context, {
        requiresRun: true,
        salt: 227,
        category: "conditional-logic-friction",
        failedAssumption: "The learner gets tripped up by `${{ }}` expressions, step outputs, or the compile loop around `if:` conditions.",
        remediation: "Keep the commit-count example close to the frontmatter edit and make the compile checkpoint explicit before the learner reruns the workflow.",
        emphasis: { bias: 0.08, conceptWeight: 0.12, terminalWeight: 0.06 },
        learningGains: { actions: 0.06, agentic: 0.04, troubleshooting: 0.03 }
      }),
    "16-connect-data-source": (state, context) =>
      advancedLessonStep(state, context, {
        requiresRun: true,
        salt: 239,
        category: "data-source-friction",
        failedAssumption: "The learner can edit the workflow, but struggles to connect real repository or API data into the prompt safely.",
        remediation: "Surface the deterministic data-fetch step, output handoff, and secret handling guidance together so the agentic prompt stays focused on interpretation.",
        emphasis: { bias: 0.07, conceptWeight: 0.1, authWeight: 0.08 },
        mutateState: (next) => {
          next.flags.hasExternalDataSource = true;
          return next;
        },
        learningGains: { actions: 0.05, agentic: 0.05, troubleshooting: 0.03 }
      }),
    "17-add-mcp-tools": (state, context) =>
      advancedLessonStep(state, context, {
        requiresRun: true,
        salt: 251,
        category: "mcp-tooling-friction",
        failedAssumption: "The learner is not yet comfortable deciding when an MCP server is worth the extra setup and trust surface.",
        remediation: "Keep the MCP concept framing and the security side quests adjacent to the first tool-server configuration example.",
        emphasis: { bias: 0.05, conceptWeight: 0.12, enterpriseWeight: 0.06 },
        mutateState: (next) => {
          next.flags.hasMcpTools = true;
          return next;
        },
        learningGains: { agentic: 0.06, troubleshooting: 0.04, github: 0.02 }
      }),
    "18-share-and-reuse": (state, context) =>
      advancedLessonStep(state, context, {
        salt: 263,
        category: "workflow-reuse-friction",
        failedAssumption: "The learner has a working workflow, but cannot yet separate what should stay local from what should become reusable.",
        remediation: "Show the boundary between repository-specific brief text and reusable frontmatter patterns more explicitly before asking the learner to extract a shared workflow.",
        emphasis: { bias: 0.06, conceptWeight: 0.1 },
        mutateState: (next) => {
          next.flags.hasReusableWorkflow = true;
          return next;
        },
        learningGains: { agentic: 0.05, actions: 0.04, confidence: 0.02 }
      }),
    "19-research-driven-training-node": (state, context) =>
      advancedLessonStep(state, context, {
        requiresRun: true,
        salt: 277,
        category: "research-node-friction",
        failedAssumption: "The learner can follow the happy path, but struggles to reason about long-running research behavior and output quality guardrails.",
        remediation: "Break the training-node pattern into smaller checkpoints that separate data collection, analysis, and output review.",
        emphasis: { bias: 0.04, conceptWeight: 0.14, complexityWeight: 0.12 },
        mutateState: (next) => {
          next.flags.hasResearchNode = true;
          return next;
        },
        learningGains: { agentic: 0.07, troubleshooting: 0.04, confidence: 0.02 }
      }),
    "20-persistent-memory": (state, context) =>
      advancedLessonStep(state, context, {
        salt: 281,
        category: "memory-pattern-friction",
        failedAssumption: "The learner sees the memory feature, but cannot yet tell when cache memory or repo memory should own the state.",
        remediation: "Keep the memory pattern decision guidance close to the first concrete example so the storage choice feels purposeful rather than magical.",
        emphasis: { bias: 0.05, conceptWeight: 0.11 },
        mutateState: (next) => {
          next.flags.usesPersistentMemory = true;
          return next;
        },
        learningGains: { agentic: 0.06, actions: 0.03, confidence: 0.02 }
      }),
    "21-inline-sub-agents": (state, context) =>
      advancedLessonStep(state, context, {
        salt: 293,
        category: "sub-agent-friction",
        failedAssumption: "The learner understands one agent, but not yet when splitting work across inline sub-agents actually reduces complexity.",
        remediation: "Pair the syntax rules with one clear decomposition example so the learner can see why each sub-agent exists.",
        emphasis: { bias: 0.03, conceptWeight: 0.14, complexityWeight: 0.1 },
        mutateState: (next) => {
          next.flags.usesInlineSubAgents = true;
          return next;
        },
        learningGains: { agentic: 0.07, troubleshooting: 0.03, confidence: 0.02 }
      }),
    "22-error-handling-and-resilience": (state, context) =>
      advancedLessonStep(state, context, {
        requiresRun: true,
        salt: 307,
        category: "resilience-friction",
        failedAssumption: "The learner knows the workflow can fail, but has trouble turning vague failure cases into deliberate retry, fallback, or guardrail behavior.",
        remediation: "Keep concrete failure examples and the recovery pattern immediately adjacent so the learner can map each tactic to a real failure mode.",
        emphasis: { bias: 0.04, conceptWeight: 0.1, complexityWeight: 0.08 },
        mutateState: (next) => {
          next.flags.hasResiliencePatterns = true;
          return next;
        },
        learningGains: { troubleshooting: 0.07, agentic: 0.04, actions: 0.03 }
      }),
    "23-ab-experiments": (state, context) =>
      advancedLessonStep(state, context, {
        requiresRun: true,
        salt: 311,
        category: "experiment-design-friction",
        failedAssumption: "The learner wants to compare prompt variants, but does not yet have a stable way to isolate one change at a time.",
        remediation: "Keep the evaluation rubric and the one-variable-at-a-time guidance visible while the learner edits experiment variants.",
        emphasis: { bias: 0.03, conceptWeight: 0.12, complexityWeight: 0.08 },
        mutateState: (next) => {
          next.flags.hasExperimentVariants = true;
          return next;
        },
        learningGains: { agentic: 0.06, troubleshooting: 0.04, confidence: 0.02 }
      }),
    "24-self-hosted-runners": (state, context) =>
      advancedLessonStep(state, context, {
        salt: 313,
        category: "self-hosted-runner-friction",
        failedAssumption: "The learner can author the workflow, but the jump to runner placement, permissions, and enterprise constraints is still steep.",
        remediation: "Keep the self-hosted runner trade-offs and prerequisite environment checks explicit before the learner edits the workflow.",
        emphasis: { bias: 0.02, enterpriseWeight: 0.14, conceptWeight: 0.09 },
        learningGains: { actions: 0.05, troubleshooting: 0.04, confidence: 0.02 }
      }),
    "25-audit-and-observability": (state, context) =>
      advancedLessonStep(state, context, {
        requiresRun: true,
        salt: 317,
        category: "audit-friction",
        failedAssumption: "The learner can run the workflow, but cannot yet connect traces, artifacts, and audit outputs back to cost or debugging decisions.",
        remediation: "Keep the audit report anatomy and one concrete investigative question together so the learner can see why observability matters.",
        emphasis: { bias: 0.04, conceptWeight: 0.11, complexityWeight: 0.08 },
        mutateState: (next) => {
          next.flags.hasAuditPractice = true;
          return next;
        },
        learningGains: { troubleshooting: 0.07, actions: 0.03, agentic: 0.03 }
      }),
    "26-manage-costs-and-budgets": (state, context) =>
      advancedLessonStep(state, context, {
        requiresRun: true,
        salt: 331,
        category: "cost-guardrail-friction",
        failedAssumption: "The learner can build the workflow, but has trouble translating usage data into practical AI Credit limits and budget guardrails.",
        remediation: "Keep the forecast output interpretation and the resulting budget edit in the same lesson so the learner can connect cost signals to action.",
        emphasis: { bias: 0.03, conceptWeight: 0.1, complexityWeight: 0.06 },
        mutateState: (next) => {
          next.flags.hasCostGuardrails = true;
          return next;
        },
        learningGains: { actions: 0.04, troubleshooting: 0.03, confidence: 0.03 }
      })
  };
}

module.exports = {
  modelVersion: MODEL_VERSION,
  modelParameters: {
    levelBaseline: LEVEL_BASELINE,
    backgroundFactors: BACKGROUND_FACTORS
  },
  STEP_IDS,
  steps: STEP_IDS,
  stepFilesById: STEP_FILE_ALIASES,
  transitions: buildTransitions(),
  buildTransitions
};
