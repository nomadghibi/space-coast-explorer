#!/usr/bin/env bash
set -euo pipefail

if git grep -nE '(SECRET_ACCESS_KEY|PASSWORD|TOKEN|API_KEY)=[^[:space:]]+' -- ':!*.example' ':!pnpm-lock.yaml'; then
  echo "Potential committed secret found."
  exit 1
fi

echo "No obvious committed secrets found."
