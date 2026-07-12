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

function hasAgentAuth(state) {
  return Boolean(state.auth?.hasApiKey || state.auth?.hasCopilotRequestToken);
}

function isOrgScopedCodespacesToken(state) {
  return state.workspace?.context === "codespaces" && state.auth?.tokenScope === "org";
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
      next.flags.hasRepo = true;
      next.flags.repoCreatedViaUi = true;
      next.flags.repoHasReadme = true;
      next.flags.environmentReady = true;
      return { ok: true, state: deepFreeze(next) };
    },
    "03-create-your-repo": (state) => {
      const repoCheck = ensure(
        state.flags.hasRepo && state.flags.repoCreatedViaUi,
        "Practice repository must be created in GitHub UI during setup",
        "repo-setup-missing",
        "In setup, create `my-agentic-workflows` from github.com/new before continuing."
      );
      if (!repoCheck.ok) return repoCheck;
      const readmeCheck = ensure(
        state.flags.repoHasReadme,
        "Practice repository is missing the starter README",
        "repo-readme-missing",
        "Enable 'Add a README file' when creating the repository in GitHub UI."
      );
      if (!readmeCheck.ok) return readmeCheck;
      const next = cloneState(state);
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
      if (isOrgScopedCodespacesToken(state)) {
        const next = cloneState(state);
        next.installed.aw = "latest";
        next.flags.usedInstallScript = true;
        next.flags.agentCredentialsConfigured = hasAgentAuth(state);
        return { ok: true, state: deepFreeze(next) };
      }
      const next = cloneState(state);
      next.installed.aw = "latest";
      next.flags.agentCredentialsConfigured = hasAgentAuth(state);
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

      const credCheck = ensure(
        hasAgentAuth(state) || state.flags.agentCredentialsConfigured,
        "Agent authentication is missing: configure an API key or Copilot request token before running the agent",
        "agent-credentials-missing",
        "Configure an API key or Copilot request token after completing gh auth login and before triggering a workflow run."
      );
      if (!credCheck.ok) return credCheck;

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
