# Event Provisioning Examples

This folder contains example assets for workshop events that pre-provision a GitHub organization, learner repositories, and Codespaces.

Use these files as source material for the provisioned environment:

- [org-profile-README.md](org-profile-README.md) is an example org welcome README for `.github-private/profile/README.md`.
- [devcontainer.json](devcontainer.json) is an example provisioned-repo Codespaces launcher for `.devcontainer/devcontainer.json`.

The reusable source content in the workshop pages is marked with HTML comments:

- `<!-- reuse:event-org-readme-intro:start -->` ... `<!-- reuse:event-org-readme-intro:end -->` in [00-welcome.md](../../00-welcome.md)
- `<!-- reuse:event-org-readme-what-youll-do:start -->` ... `<!-- reuse:event-org-readme-what-youll-do:end -->` in [00-welcome.md](../../00-welcome.md)
- `<!-- reuse:event-provisioned-start:start -->` ... `<!-- reuse:event-provisioned-start:end -->` in [00-welcome.md](../../00-welcome.md)

Those markers make it clear which workshop prose is safe to mirror into event-specific surfaces without reauthoring it from scratch.
