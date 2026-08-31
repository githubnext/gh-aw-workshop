<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows at Scale

> _Enterprise teams need more than working automations — they need policies, guardrails, and evidence that AI agents behaved appropriately._

## :dart: What You'll Do

You'll apply a practical governance model to your agentic workflows: define an approval policy using [concurrency controls](https://github.github.com/gh-aw/reference/concurrency/), limit what an agent can write using [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/) and [permissions](https://github.github.com/gh-aw/reference/permissions/), and produce a compliance report using [audit artifacts](https://github.github.com/gh-aw/reference/audit/). By the end of this step you'll have a reproducible governance baseline that satisfies most enterprise security review requirements.

## :clipboard: Before You Start

- You completed [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md).
- Your workflow runs successfully and compiles without errors (see [Install the gh-aw CLI Extension](06-install-gh-aw.md) and [Refine, Test, and Improve Your Workflow](09-agentic-editing.md)).
- You have write access to your practice repository's **Settings → Environments** page (the golden-ticket system grants this automatically).

## Steps

### Limit agent write permissions

Open your workflow file and ask your AI agent to tighten the permissions block so the agent only holds the rights it needs:

```prompt
/agentic-workflows Restrict daily-status to the minimum permissions: read-only repository access, issues write-only, no other permissions.
```

Check the compiled frontmatter after the agent edits it. A strict governance baseline looks like this:

```yaml
---
permissions:
  contents: read
  issues: write
---
```

> [!NOTE]
> `contents: read` prevents the agent from pushing commits or creating branches. The agent can still open issues because `issues: write` is present.

Compile to confirm the change is valid:

```bash
gh aw compile
```

### Constrain safe-output allowlists

In your workflow's brief, ask your agent to constrain the safe-output block so only one comment per run is permitted:

```prompt
/agentic-workflows add a safe_outputs block to daily-status that allows at most one issue comment and blocks any file writes or pull request actions.
```

Review the updated brief for a block that looks like this:

```yaml
safe_outputs:
  COMMENT:
    max: 1
  FILE:
    enabled: false
  PULL_REQUEST:
    enabled: false
```

Run `gh aw compile` again and confirm no warnings appear.

### Apply a concurrency policy

Concurrency limits prevent parallel agent runs from racing to write the same output. Ask your agent to add a concurrency group:

```prompt
/agentic-workflows add a concurrency group named "daily-status-${{ github.ref }}" with cancel-in-progress set to false so queued runs wait instead of being cancelled.
```

The compiled YAML will include:

```yaml
concurrency:
  group: daily-status-${{ github.ref }}
  cancel-in-progress: false
```

### Produce a governance report

Use `gh aw audit` to export a compliance report for the most recent run:

```bash
gh aw audit --report governance-report.md
```

Open `governance-report.md` in the Codespace editor. The report lists the model used, token counts, safe-output calls made, and the permissions in effect.

### Protect sensitive runs with a required environment

For workflows that touch production data, restrict them to run only when a GitHub environment approval is granted:

1. Go to **Settings → Environments** and create an environment named `agentic-production`.
2. Add yourself (or a team) as a **required reviewer**.
3. Ask your agent to assign that environment to your workflow:

```prompt
/agentic-workflows set the runs-on environment for daily-status to "agentic-production" so the run waits for a required reviewer before the agent starts.
```

After compiling and pushing, the next workflow trigger will pause at the environment gate and wait for an explicit approval in the Actions tab.

## :white_check_mark: Checkpoint

- [ ] Your workflow's `permissions` block grants `contents: read` and scopes write access to only the outputs the agent needs
- [ ] The `safe_outputs` block limits writes to one comment per run and disables pull-request and file write actions
- [ ] A `concurrency` group is set so parallel runs queue rather than cancel
- [ ] `gh aw compile` succeeds with no warnings after each change
- [ ] You generated a `governance-report.md` using `gh aw audit --report` and can identify the model, token count, and safe-output calls listed in it
- [ ] You can explain in plain English why each governance control exists and what risk it mitigates

**Next:** [What's Next? Keep Exploring](14-next-steps.md)
