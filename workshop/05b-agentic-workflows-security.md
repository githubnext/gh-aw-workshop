<!-- page-journey: all -->
<!-- page-adventure: core -->
# How Agentic Workflows Stay Safe

## 📋 Before You Start

- You've read [What Are Agentic Workflows?](05-agentic-workflows-intro.md)

Letting an AI agent act on your repository on a schedule only works if it can't do damage. Agentic workflows enforce two trust boundaries so you can run agents in automation with confidence.

![Animated GitHub Actions run showing four security jobs: activation validates the agent is authorized to run, agent runs with sandbox, firewall, and integrity filter enabled, detection scans for malicious code, and safe-outputs applies changes within guardrails](images/05-agent-run-log.svg)

## Safe by design: sandbox + guardrailed outputs

- **A [sandbox](https://github.github.com/gh-aw/reference/sandbox/) around the agent.** The agent runs isolated inside the [Agent Workflow Firewall](https://github.github.com/gh-aw/reference/sandbox/), with **read-only** access to your repo and network egress limited to the domains you allow. Even if a prompt injection or a compromised tool tries to reach out or exfiltrate data, the firewall blocks anything outside the allowlist.
- **A guardrailed [safe-output](https://github.github.com/gh-aw/reference/safe-outputs/) system for writes.** The agent never holds write permissions. Instead, it emits a *structured request* — "create this issue," "post this comment" — and a separate, permission-scoped job validates and executes it, applying per-operation limits (max counts, label and title constraints, allowed repos). That separation gives you least privilege, defense against prompt injection, and a full audit trail of every action.

The security jobs in the run log above map to these boundaries: **activation** checks the agent is authorized to run, the **agent** runs sandboxed behind the firewall, **detection** scans for malicious behavior, and **safe-outputs** applies changes within the guardrails.

<details>
<summary>Why can't the agent just write to the repo directly?</summary>

Direct write access would make every prompt injection a potential supply-chain attack. By keeping the agent read-only and routing all changes through the safe-output system, a malicious instruction the agent picks up from issue text or a fetched page can, at worst, produce a *request* that the guardrails then reject or cap — it can never silently push code, leak secrets, or open unlimited pull requests.

</details>

## Try it: sandbox or safe-output?

For each scenario below, decide whether the **sandbox** or the **safe-output system** is the primary defence. Make your decision before revealing the answer.

**Scenario A:** A prompt injected into an issue comment instructs the agent to push to a protected branch.

- [ ] I've made my decision for Scenario A

<details>
<summary>Reveal Scenario A answer</summary>

**Safe-output system.** The agent holds no write permissions. Even if the injected instruction causes the agent to produce a write request, the separate permission-scoped job validates it against the guardrails and rejects any operation outside the allowed set.

</details>

**Scenario B:** A page the agent fetches during a run tries to send your repository secrets to an external server.

- [ ] I've made my decision for Scenario B

<details>
<summary>Reveal Scenario B answer</summary>

**Sandbox / Agent Workflow Firewall.** Outbound network traffic is limited to the domain allowlist. Any request to an unlisted domain is blocked at the firewall before it leaves the runner — the exfiltration attempt never reaches the external server.

</details>

## ✅ Checkpoint

- [ ] I can describe what the sandbox does and why it matters for automation safety
- [ ] I can explain how the safe-output system prevents the agent from writing to the repo directly
- [ ] I can identify whether the sandbox or the safe-output system is the primary defence for a given scenario
- [ ] I can explain how the two-layer model makes agentic workflows safe to run on a schedule

<!-- journey: all -->
**Next:** [Install the gh-aw CLI Extension](06-install-gh-aw.md)
<!-- /journey -->
