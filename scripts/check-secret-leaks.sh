#!/bin/sh

set -eu

echo "Checking for committed secret-like values..."

matches="$(
  rg -n --hidden \
    --glob '!.git/**' \
    --glob '!node_modules/**' \
    --glob '!**/dist/**' \
    --glob '!**/build/**' \
    --glob '!coverage/**' \
    --glob '!**/.env' \
    --glob '!**/.env.*' \
    --glob '!**/.env.example' \
    --glob '!**/.env.development.example' \
    --glob '!**/.env.staging.example' \
    --glob '!**/.env.production.example' \
    --glob '!scripts/check-secret-leaks.sh' \
    -e 'mongodb\+srv://[^<[:space:]]+' \
    -e 'JWT_ACCESS_SECRET=' \
    -e 'rzp_live_' \
    -e '-----BEGIN PRIVATE KEY-----' \
    -e 'AIza' \
    . | cut -d ':' -f 1 | sort -u || true
)"

if [ -n "$matches" ]; then
  echo "Secret-like values found outside allowed env files:"
  echo "$matches"
  exit 1
fi

echo "Secret leak check passed."
