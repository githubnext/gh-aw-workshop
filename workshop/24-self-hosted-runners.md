# Run Your Agentic Workflow on a Self-Hosted Runner

> _Enterprise teams often need workflows to run on their own infrastructure — this step shows you exactly how._

## 🎯 What You'll Do

You will update your workflow's frontmatter to target a self-hosted runner using a runner label.
By the end of this step, your agentic workflow will queue on a runner your organisation manages
rather than a GitHub-hosted machine.

## 📋 Before You Start

- Your agentic workflow runs successfully (see [Step 12: Test and Iterate](12-test-and-iterate.md)).
- A self-hosted runner is registered and **online** for your repository or organisation.
  If you need to set one up first, see [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md).
- You know the label assigned to your runner (for example, `self-hosted`, `ubuntu-self-hosted`, or a custom label your admin configured).

> [!NOTE]
> Not on an enterprise plan? GitHub-hosted runners work for the main workshop path. Come back to this step if you later move to a GHES or GHEC environment with self-hosted runners.

## Understand runner targeting in frontmatter

An agentic workflow's frontmatter is compatible with standard GitHub Actions YAML.
The `runs-on:` field tells Actions which runner to use — it works identically for
agentic workflows and classic jobs.

Your current workflow likely targets a GitHub-hosted runner. Look for the `runs-on:` field in your frontmatter:

```yaml
runs-on: ubuntu-latest
```

The only change needed is the value of `runs-on:`.

## Update the runner label

### Open your workflow file

Open `.github/workflows/daily-status.md` (or whichever workflow you want to move).

<details>
<summary>🖥️ GitHub UI path</summary>

1. In your repository on GitHub, navigate to `.github/workflows/daily-status.md`.
2. Click the **pencil icon (✏️)** to open the editor.
3. Edit the `runs-on:` line as described below.
4. Click **Commit changes**.

</details>

<details>
<summary>💻 Terminal path</summary>

Open the file in your editor of choice:

```bash
code .github/workflows/daily-status.md
```

</details>

### Change the `runs-on:` value

Replace `ubuntu-latest` with your runner's label.
Use a list if your runner has multiple required labels:

**Single label:**

```yaml
runs-on: self-hosted
```

**Multiple labels (all must match):**

```yaml
runs-on: [self-hosted, linux, x64]
```

The labels must exactly match what your admin registered on the runner.
Ask your admin if you are unsure — they can find the labels in the runner's
registration settings under **Settings → Actions → Runners**.

> [!TIP]
> Labels act as filters. A workflow job is dispatched to the first idle runner that satisfies **all** labels in the list. Adding `linux` alongside `self-hosted` ensures the job only lands on Linux runners when your fleet is mixed.

## If you adapt another workflow, update activation and safe-outputs too

If you copied a workflow from another workshop step or repository, do a quick frontmatter pass before compiling:

- **Activation (`on:`):** replace the trigger with how you want this workflow to start in your repository (`workflow_dispatch`, `schedule`, `pull_request`, and so on).
- **Safe outputs (`safe-outputs:`):** replace write actions to match your task. Keep only the minimum actions you actually want this workflow to perform.
- **Other runner entries:** if the file has more than one `runs-on:` value, replace each GitHub-hosted label (`ubuntu-latest`, `windows-latest`, `macos-latest`) with your self-hosted label strategy.

This keeps runner routing, workflow activation, and write permissions aligned after you reuse an existing workflow.

## Handle proxy and network requirements

Self-hosted runners in enterprise environments often sit behind an outbound proxy.
The agentic engine needs to reach model endpoints and GitHub APIs.

If your runner uses a proxy, set these environment variables in the runner's system
configuration **before** registering it, or ask your admin to confirm they are already set:

```bash
HTTPS_PROXY=https://proxy.example.com:3128
HTTP_PROXY=http://proxy.example.com:3128
NO_PROXY=localhost,127.0.0.1,github.example.com
```

You do **not** need to add these to the workflow file itself — the runner process
inherits them from the system environment automatically.

> [!NOTE]
> The exact proxy hostname and port come from your network team or enterprise admin. The values above are examples only.

## Compile and commit

If you are on the terminal path, recompile after editing the frontmatter:

```bash
gh aw compile daily-status
```

Commit both the `.md` source and the regenerated `.lock.yml`:

```bash
git add .github/workflows/daily-status.md .github/workflows/daily-status.lock.yml
git commit -m "chore: target self-hosted runner for daily-status workflow"
git push
```

UI-first learners: commit the `.md` file using the web editor. The lock file regenerates
automatically on the next workflow run when you push the updated source — you do not need to
compile locally.

## Verify the run lands on your runner

1. Go to the **Actions** tab in your repository.
2. Trigger your workflow with **Run workflow**.
3. Open the run and look at the job summary.
4. Confirm the **Runner** field shows your self-hosted runner name (not `GitHub Actions`).

![Runner name shown in the Actions job summary](images/24-self-hosted-runner-job.svg)

## ✅ Checkpoint

- [ ] Your workflow's `runs-on:` value matches the label of your self-hosted runner
- [ ] `gh aw compile` (if used) completed without errors
- [ ] The updated `.github/workflows/daily-status.md` is committed and pushed
- [ ] A manual workflow run completed and the Actions log shows your self-hosted runner name
- [ ] You can explain why a list of labels (`[self-hosted, linux, x64]`) narrows runner selection
- [ ] You know where to configure proxy environment variables for a self-hosted runner

**Next:** [What's Next? Keep Exploring](14-next-steps.md)

## 📚 See Also

- [Self-hosted runners documentation](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners)
- [Runner labels reference](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/using-labels-with-self-hosted-runners)
- [Side Quest: Enterprise Setup Considerations](side-quest-enterprise-setup.md)
- [Connect a Live Data Source to Your Workflow](16-connect-data-source.md)
