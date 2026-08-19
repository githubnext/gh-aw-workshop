<!-- page-journey: all -->
<!-- page-adventure: advanced -->
# Govern Agentic Workflows for Enterprise Teams

> _Lock down who can run AI workflows, what they can do, and what gets recorded — so your organisation can move fast without losing control._

## :dart: What You'll Do

You'll apply three enterprise governance controls to your agentic workflow: scope the permissions it needs, add a required-reviewer gate for sensitive outputs, and confirm that your audit trail is accessible to compliance teams. By the end, you'll have a workflow that only holds the permissions it uses and cannot silently perform destructive actions without a human sign-off.

## :clipboard: Before You Start

- You completed [Teach Your Agent Domain Knowledge with Skills](29-skills-and-domain-knowledge.md).
- Your organisation uses GitHub Enterprise Cloud (GHEC) or GitHub Enterprise Server (GHES) 3.12 or later.
- You can edit workflows and compile them with `gh aw compile`.

## Understand the governance layers

Agentic workflows touch real repositories, issues, pull requests, and external services. In an enterprise context, three controls matter most:

| Control | What it does | Where it lives |
|---|---|---|
| **Minimum permissions** | Limits what the agent's token can read or write | Frontmatter `permissions:` block |
| **Required reviewer** | Pauses the run before a sensitive safe output fires | Frontmatter `safe-outputs:` block |
| **Audit trail** | Records every run, token count, and output for compliance | GitHub Actions logs + AIC billing dashboard |

You've already touched permissions and auditing in earlier steps. This node brings them together in a single governance-focused design review.

## Steps

### Audit your current permissions block

Open your workflow file and locate the `permissions:` block. If it is missing, the workflow inherits the repository-wide default — usually `contents: read` plus implicit Actions permissions.

Ask your agent to do a permissions audit:

```prompt
/agentic-workflows review my daily-status workflow permissions and reduce them to the minimum required
```

A minimal read-only workflow that creates issues typically needs:

```yaml
permissions:
  contents: read
  issues: write
```

Remove every scope that the agent does not demonstrably use. Fewer permissions means a compromised or confused agent cannot accidentally delete branches or open pull requests.

> [!TIP]
> Check the [permissions reference](https://github.github.com/gh-aw/reference/permissions/) to see which scopes each safe-output type requires. The compiler will warn when a declared safe-output requires a scope not listed in `permissions:`.

### Add a required-reviewer gate

A **required reviewer** pauses the workflow run at a specific safe-output step and sends a notification to one or more GitHub teams or users. The run resumes only when a reviewer approves — or it is cancelled if the deadline passes.

This is valuable when the output could have external consequences: posting a public comment, opening a production issue, or triggering a downstream deployment.

To add a gate to your workflow, ask your agent:

```prompt
/agentic-workflows add a required-reviewer gate to my daily-status workflow so a team member must approve before the status issue is created
```

The compiled result will include a `required-reviewers` entry referencing your team. Confirm the reviewer gate appeared in the `.lock.yml` by searching for `environment:` in the compiled file:

```bash
grep -A5 "environment:" .github/workflows/daily-status.lock.yml
```

GitHub Actions uses **deployment environments** under the hood to implement required-reviewer gates. Verify the environment exists in **Settings → Environments** and that the correct protection rules are in place.

### Verify your audit trail is reachable

Enterprise compliance teams need to answer: who ran this workflow, when, what did the agent do, and how many AI credits did it consume?

Run your workflow once manually, then check the audit artifacts:

```bash
gh aw logs daily-status
```

Confirm the output includes:

- Run ID and trigger type
- Model name and version
- Total AIC consumed
- Each safe-output emitted and its approval status (if a reviewer gate was set)

> [!NOTE]
> If your organisation uses a SIEM or exports Actions logs to an external system, confirm with your security team that agentic workflow runs appear in that export. AIC billing data is available in **Settings → Billing → GitHub Copilot** and via the [billing API](https://github.github.com/gh-aw/reference/billing/).

### Validate and compile

After updating permissions and adding the reviewer gate, validate the frontmatter:

```bash
gh aw compile daily-status
```

Fix any warnings before pushing. Unpermissioned safe-output types and missing environment names are the most common compile-time governance errors.

## :white_check_mark: Checkpoint

- [ ] Your workflow `permissions:` block lists only the scopes the agent actually uses
- [ ] `gh aw compile` succeeds with no permission warnings
- [ ] A required-reviewer gate is configured for at least one sensitive safe-output step
- [ ] The deployment environment protecting that gate appears in **Settings → Environments**
- [ ] You ran `gh aw logs` and confirmed the AIC summary is visible in the run output
- [ ] You can explain to a compliance reviewer where to find the audit trail for an agentic workflow run

<!-- journey: all -->
Want to choose another branch from the workshop hub? Return to [What's Next? Keep Exploring](14-next-steps.md).
<!-- /journey -->
