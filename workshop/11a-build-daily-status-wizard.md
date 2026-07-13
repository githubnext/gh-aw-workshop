# Adventure A: Build Daily Status with the Add Wizard

> _The add wizard is the fastest way to get a curated workflow running — it handles engine selection, secrets, and the pull request for you._

## 🎯 What You'll Do

Instead of writing the `daily-status` workflow file by hand, you'll use the `gh aw add-wizard` command to pull a curated workflow from the community catalog, configure it interactively, and have it committed to your repository — all in one guided flow. By the end you'll have the same working workflow as the manual path, ready to run.

## 📋 Before You Start

- You've completed [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
- Your terminal is inside `my-agentic-workflows`
- [`gh aw` is installed and authenticated](06-install-gh-aw.md) — completed in Step 6

> [!NOTE]
> This is the **wizard path** for Step 11. If you prefer to understand every line of the workflow file before running it, use the [manual build path](11a-build-daily-status.md) instead. Both paths produce the same result and converge at [Step 12](12-test-and-iterate.md).

---

## What `gh aw add-wizard` Does

The `add-wizard` command pulls an existing workflow from the `githubnext/agentics` community catalog and walks you through a short interactive setup:

| Wizard step | What happens |
|---|---|
| Engine selection | You pick an AI engine: Copilot, Claude, Codex (OpenAI), Gemini, or Crush (GitHub Next) |
| Secret configuration | The wizard prompts for any API keys the chosen engine needs and stores them as GitHub Actions secrets |
| Pull request | The wizard commits the workflow file and opens a pull request in your repository |
| Optional run | You can trigger the workflow immediately or leave it for the schedule |

> [!TIP]
> The catalog workflow (`githubnext/agentics/daily-repo-status`) is maintained by the `gh-aw` team and is kept up to date with the latest YAML frontmatter conventions. Adding it via the wizard means you always get a validated, production-ready starting point.

---

## Run the Wizard

Make sure you are inside your `my-agentic-workflows` repository directory, then run:

```bash
gh aw add-wizard githubnext/agentics/daily-repo-status
```

The wizard will guide you through each step interactively. Here is what to expect:

### Select an AI engine

The wizard asks which AI engine should power the workflow. Choose **Copilot** to use GitHub Copilot (no additional API key needed if your account has Copilot access).

```
? Select AI engine:
  ❯ Copilot
    Claude
    Codex
    Gemini
    Crush
```

> [!NOTE]
> **Using an engine other than Copilot?** You will need an API key for that provider. The wizard will prompt you to enter it and offer to store it as a GitHub Actions secret in your repository so the workflow can use it at runtime.
>
> - ➡️ [Side Quest: Configure an Anthropic API Key](side-quest-11-06-anthropic-key.md) — for the `claude` engine
> - ➡️ [Side Quest: Configure an OpenAI API Key](side-quest-11-07-openai-key.md) — for the `codex` engine

### Review the secret prompt

If you selected Copilot and your repository already has the required secret (or Copilot does not need one), the wizard skips this step. For other engines it asks:

```
? An API key is required for this engine.
  Store it as a GitHub Actions secret now? (Y/n)
```

Enter `Y` and paste your API key when prompted. The wizard saves it securely — it will never appear in the workflow file.

> [!TIP]
> Already have the secret stored at the organization level? Run the wizard with `--no-secret` to skip the prompt:
> ```bash
> gh aw add-wizard githubnext/agentics/daily-repo-status --no-secret
> ```

### Confirm the pull request

The wizard shows a summary of the workflow it is about to add and asks whether to create a pull request:

```
? Create a pull request with these changes? (Y/n)
```

Enter `Y`. The wizard commits `.github/workflows/daily-status.md` and the compiled `.github/workflows/daily-status.lock.yml` and opens a pull request for you.

### Merge the pull request

After the wizard exits, open the pull request link it printed and merge it into `main`.

> [!TIP]
> If you prefer to merge from the terminal:
> ```bash
> gh pr merge --merge --auto
> ```

---

## Verify the Workflow File

After merging, confirm the workflow file landed correctly:

```bash
gh aw validate .github/workflows/daily-status.md
```

You should see:

```
✔ daily-status.md — valid
```

> [!NOTE]
> The wizard also writes the compiled `.github/workflows/daily-status.lock.yml` file alongside the Markdown source. You do not need to run `gh aw compile` separately — the wizard already did it for you.

---

## What Was Added

The wizard added two files to your repository:

| File | Purpose |
|---|---|
| `.github/workflows/daily-status.md` | The Markdown task brief for the AI agent — the human-readable workflow definition |
| `.github/workflows/daily-status.lock.yml` | The compiled GitHub Actions YAML that GitHub Actions actually runs |

> [!TIP]
> Curious about what is inside `daily-status.md`? Open it in your editor and compare it to the [manual build walkthrough](11a-build-daily-status.md). The YAML frontmatter sections — `emoji`, `description`, `on`, `permissions`, `tools`, and `safe-outputs` — are explained there in detail.

---

## ✅ Checkpoint

- [ ] `gh aw add-wizard githubnext/agentics/daily-repo-status` completed without errors
- [ ] The pull request was created and merged into `main`
- [ ] `.github/workflows/daily-status.md` exists in your repository
- [ ] `gh aw validate .github/workflows/daily-status.md` reports no errors

**Previous:** [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
