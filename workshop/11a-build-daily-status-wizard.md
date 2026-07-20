---
journey: all
adventure: scenario-a
---
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

The `add-wizard` command pulls the `githubnext/agentics` workflow from the community catalog and guides you through one short setup flow: choose an AI engine, add any required secret, open a pull request, and optionally run the workflow right away. Because the catalog workflow is maintained by the `gh-aw` team, you start from an up-to-date, validated template.

---

## Run the Wizard

Make sure you are inside your `my-agentic-workflows` repository directory, then run:

```bash
gh aw add-wizard githubnext/agentics/daily-repo-status
```

The wizard will guide you through each step interactively. Here is what to expect:

### Select an AI engine

The wizard asks which AI engine should power the workflow. Choose **Copilot** to use GitHub Copilot (no additional API key needed if your account has Copilot access).

> 🤔 **Predict:** Before you run the wizard, decide which AI engine you want to use and whether you have an API key for it. If you choose anything other than Copilot, have your API key ready before you proceed.

```
? Select AI engine:
  ❯ Copilot
    Claude
    Codex
    Gemini
    Crush
```

If you choose an engine other than Copilot, you will need that provider's API key. The wizard will prompt you to enter it and offer to store it as a GitHub Actions secret for runtime use. If you want help preparing the key first, use [Side Quest: Configure an Anthropic API Key](side-quest-11-06-anthropic-key.md) for `claude` or [Side Quest: Configure an OpenAI API Key](side-quest-11-07-openai-key.md) for `codex`.

### Review the secret prompt

If you selected Copilot and your repository already has the required secret (or Copilot does not need one), the wizard skips this step. For other engines it asks:

```
? An API key is required for this engine.
  Store it as a GitHub Actions secret now? (Y/n)
```

Enter `Y` and paste your API key when prompted. The wizard saves it securely — it will never appear in the workflow file.

If you already have the secret stored at the organization level, run the wizard with `--no-secret` to skip the prompt:

```bash
gh aw add-wizard githubnext/agentics/daily-repo-status --no-secret
```

### Confirm the pull request

The wizard shows a summary of the workflow it is about to add and asks whether to create a pull request:

```
? Create a pull request with these changes? (Y/n)
```

Enter `Y`. The wizard commits `.github/workflows/daily-status.md` and the compiled `.github/workflows/daily-status.lock.yml` and opens a pull request for you.

### Merge the pull request

After the wizard exits, open the pull request link it printed and merge it into `main`.

If you prefer to merge from the terminal, run:

```bash
gh pr merge --merge --auto
```

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

The wizard also writes the compiled `.github/workflows/daily-status.lock.yml` file alongside the Markdown source, so you do not need to run `gh aw compile` separately.

---

## What Was Added

The wizard added two files to your repository:

| File | Purpose |
|---|---|
| `.github/workflows/daily-status.md` | The Markdown task brief for the AI agent — the human-readable workflow definition |
| `.github/workflows/daily-status.lock.yml` | The compiled GitHub Actions YAML that GitHub Actions actually runs |

If you want to see what is inside `daily-status.md`, open it in your editor and compare it to the [manual build walkthrough](11a-build-daily-status.md). That walkthrough explains the `emoji`, `description`, `on`, `permissions`, `tools`, and `safe-outputs` frontmatter sections in detail.

---

## ✅ Checkpoint

- [ ] `gh aw add-wizard githubnext/agentics/daily-repo-status` completed without errors
- [ ] The pull request was created and merged into `main`
- [ ] `.github/workflows/daily-status.md` exists in your repository
- [ ] `gh aw validate .github/workflows/daily-status.md` reports no errors

**Previous:** [Step 10a: Design — Daily Repo Status Report](10a-design-daily-status.md)
<!-- journey: all -->
**Next:** [Step 12: Test and Improve Your Workflow](12-test-and-iterate.md)
<!-- /journey -->

## 📚 See Also

- [Overview of GitHub Agentic Workflows](https://github.github.com/gh-aw/introduction/overview/)
- [Triggers reference](https://github.github.com/gh-aw/reference/triggers/)
- [Safe Outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Tools reference](https://github.github.com/gh-aw/reference/tools/)
