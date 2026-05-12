#!/bin/sh
set -eu

API_BASE_URL="${API_BASE_URL:-http://localhost:5000}"
HEALTH_URL="$API_BASE_URL/api/v1/public/health"
response_file="$(mktemp)"

cleanup() {
  rm -f "$response_file"
}

trap cleanup EXIT

if ! status_code="$(curl -sS -o "$response_file" -w "%{http_code}" "$HEALTH_URL")"; then
  status_code="000"
fi

if [ "$status_code" = "200" ]; then
  echo "Backend health check passed: HTTP 200"
  exit 0
fi

echo "Backend health check failed: HTTP $status_code"
exit 1
