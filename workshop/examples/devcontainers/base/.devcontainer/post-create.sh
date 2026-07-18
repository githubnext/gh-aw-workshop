#!/usr/bin/env bash
set -euo pipefail

if command -v code >/dev/null 2>&1; then
  code --install-extension GitHub.copilot --force
  code --install-extension GitHub.copilot-chat --force
else
  echo "The code CLI is not available during post-create."
  echo "GitHub Copilot extensions will still install from devcontainer customizations."
fi