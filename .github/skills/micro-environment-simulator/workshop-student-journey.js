"use strict";

const { VALID_TERMINALS, ensure } = require("./simulator");

const STEP_IDS = [
  "00-welcome",
  "01-prerequisites",
  "02-setup",
  // Keep this ID aligned with the workshop filename `03-create-your-repo.md`.
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

const PROVIDER_SECRET_BY_NAME = {
  github: "COPILOT_GITHUB_TOKEN",
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY"
};

function requiredSecretForProvider(provider) {
  return PROVIDER_SECRET_BY_NAME[provider] || null;
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
    "02-setup": (state) => {
      const terminalCheck = ensure(
        VALID_TERMINALS[state.os] && VALID_TERMINALS[state.os].has(state.terminal),
        `Terminal '${state.terminal}' is not valid for OS '${state.os}'`,
        "terminal-os-mismatch",
        "Use bash/zsh for macOS/Linux and powershell/cmd for Windows."
      );
      if (!terminalCheck.ok) return terminalCheck;
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
      return { ok: true, state: deepFreeze(next) };
    },
    "03-create-your-repo": (state) => {
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
      const next = cloneState(state);
      if (needsRepoCreation) {
        next.flags.hasRepo = true;
        next.flags.repoCreatedViaUi = true;
        next.flags.repoHasReadme = true;
      }
      next.flags.repoVerified = true;
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
        "Run `gh auth status` first (Codespaces sessions are often pre-authenticated); if needed, run `gh auth login` before triggering workflow runs."
      );
      if (!authCheck.ok) return authCheck;

      const provider = state.actions?.inferenceProvider;
      const providerCheck = ensure(
        provider === "github" || provider === "anthropic" || provider === "openai",
        "Workflow run is missing a supported model inference provider configuration",
        "inference-provider-missing",
        "Set the workflow model provider to github, anthropic, or openai before running."
      );
      if (!providerCheck.ok) return providerCheck;

      const requiredSecret = requiredSecretForProvider(provider);
      const hasRequiredSecret = Boolean(state.actions?.secrets?.[requiredSecret]);
      const providerSecretCheck = ensure(
        hasRequiredSecret,
        `Required Actions secret '${requiredSecret}' is not configured for '${provider}' inference`,
        "provider-secret-missing",
        `Add repository or organization Actions secret '${requiredSecret}' before running the workflow.`
      );
      if (!providerSecretCheck.ok) return providerSecretCheck;

      if (provider === "github") {
        if (state.actions?.permissions?.copilotRequestsWrite !== true) {
          if (state.auth?.accountType === "enterprise-managed") {
            return ensure(
              false,
              "Enterprise GitHub inference requires `permissions.copilot-requests: write` to enable org billing",
              "org-billing-not-enabled",
              "Set `permissions.copilot-requests: write` for enterprise workflows that use GitHub inference."
            );
          }
          return ensure(
            false,
            "Workflow is missing `permissions.copilot-requests: write` for GitHub inference",
            "copilot-permission-missing",
            "Add `permissions.copilot-requests: write` to the workflow frontmatter."
          );
        }
      }

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

module.exports = {
  STEP_IDS,
  steps: STEP_IDS,
  transitions: buildTransitions(),
  buildTransitions
};
