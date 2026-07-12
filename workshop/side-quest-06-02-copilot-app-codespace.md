# Side Quest: Use `gh-aw` with the Copilot App

Use this side quest if you're working in the GitHub Copilot app and need a terminal for `gh aw` commands.

## What you'll do

You'll open a GitHub Codespace from your browser, verify `gh` access, install `gh-aw`, and return to the main workshop flow.

## Open a Codespace

From [Step 6](06-install-gh-aw.md), select the **Open in GitHub Codespaces** button in the `copilot-app` on-ramp section.

When the Codespace finishes loading:

1. Open the terminal tab.
2. Run `gh auth status`.
3. If needed, run `gh auth login` and complete browser sign-in.

## Install `gh-aw` in the Codespace terminal

Run:

```bash
gh extension install github/gh-aw
```

If it's already installed, run:

```bash
gh extension upgrade github/gh-aw
```

Then verify:

```bash
gh aw --version
```

If you hit an HTTP 403 install error in an org-owned Codespace, use [Side Quest: Install `gh-aw` Troubleshooting](side-quest-06-01-install-troubleshooting.md#organization-codespace-token-limitation-http-403).

## Return to the main workshop

Go back to [Step 6: Install the `gh-aw` CLI Extension](06-install-gh-aw.md), then continue to [Step 7](07-your-first-workflow.md).

## ✅ Checkpoint

- [ ] You opened a Codespace from the browser
- [ ] `gh auth status` confirms you're logged in
- [ ] `gh aw --version` returns a version number
- [ ] You're ready to continue at Step 7
