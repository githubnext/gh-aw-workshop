# Side Quest: Install `gh-aw` Troubleshooting

> _Optional: use this guide if Step 6 install fails, then return to the main path._

If `gh extension install github/gh-aw` fails, use the matching fix below and retry.

---

## Local terminal setup quick fixes (Adventure B)

If you are still in local terminal setup and not yet installing `gh-aw`, use this table first:

| Error message | Why it happens | How to fix it |
|------|------|------|
| `command not found` | Tool is missing or terminal session has not picked up install yet | Install/reinstall the tool from the step above, then fully close and reopen terminal |
| `permission denied` | Command needs elevated privileges or file permissions are restricted | Re-run the Linux/macOS install command with `sudo` exactly as shown; on Windows use an elevated terminal when needed |
| `No such file or directory` / path-related errors | You are not in the expected folder | Run `pwd` (macOS/Linux) or `cd` with no arguments (Windows) to check your location, then `cd my-agentic-workflows` and retry |

---

## Not authenticated (HTTP 401)

If you see errors like:

```text
error connecting to api.github.com: HTTP 401: Bad credentials
```

or:

```text
failed to authenticate to api.github.com
```

Run:

```bash
gh auth login
gh auth status
gh extension install github/gh-aw
```

Confirm `gh auth status` shows `Logged in to github.com`.

---

## Organization Codespace token limitation (HTTP 403)

In an org-owned Codespace, `gh` can be pre-authenticated with an org-scoped token.
Installing `github/gh-aw` from the marketplace can fail with HTTP 403 even though auth is valid.

If that happens, use the install script from the gh-aw installation instructions:

```bash
curl -sL https://raw.githubusercontent.com/github/gh-aw/main/install-gh-aw.sh | bash
gh aw --version
```

You usually do **not** need to run `gh auth login` for this case.

---

## Behind a corporate proxy

Set proxy variables in your current shell, then retry:

```bash
export HTTPS_PROXY="http://proxy.company.com:8080"
export HTTP_PROXY="$HTTPS_PROXY"
export NO_PROXY="127.0.0.1,localhost,.company.com"
gh config set git_protocol https
gh auth status
gh extension install github/gh-aw
```

---

## GitHub Enterprise Server (GHE/GHES) endpoint

Authenticate against your GHES hostname and install with `--hostname`:

```bash
gh config set git_protocol https --host ghes.example.com
gh auth login --hostname ghes.example.com --scopes "repo,read:org,workflow"
gh extension install github/gh-aw --hostname ghes.example.com
gh auth status --hostname ghes.example.com
```

If your administrator requires different scopes, use the minimum required scopes they provide.

---

## Extension download fails on a locked-down network

If install fails with a network error:

1. Download the matching release artifact from [github/gh-aw releases](https://github.com/github/gh-aw/releases).
2. Extract it on a machine that can reach GitHub.
3. Move the extracted folder to your workshop machine and install from a local path:

```bash
gh extension install /path/to/gh-aw
gh extension list
```

---

Return to [Step 6: Install the gh-aw CLI Extension](06-install-gh-aw.md).
