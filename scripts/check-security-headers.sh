#!/bin/sh

set -eu

API_BASE_URL="${API_BASE_URL:-http://localhost:5000}"
HEALTH_URL="$API_BASE_URL/api/v1/public/health"

headers="$(curl -s -I "$HEALTH_URL" || true)"

if [ -z "$headers" ]; then
  echo "Security header check failed: no response from $HEALTH_URL"
  exit 1
fi

check_header() {
  header_name="$1"

  if echo "$headers" | tr '[:upper:]' '[:lower:]' | rg -q "^$header_name:"; then
    echo "PASS $header_name"
    return
  fi

  echo "FAIL $header_name"
  exit 1
}

check_absent_header() {
  header_name="$1"

  if echo "$headers" | tr '[:upper:]' '[:lower:]' | rg -q "^$header_name:"; then
    echo "FAIL $header_name must not be exposed"
    exit 1
  fi

  echo "PASS $header_name absent"
}

check_header "x-dns-prefetch-control"
check_header "x-frame-options"
check_header "x-content-type-options"
check_header "referrer-policy"
check_absent_header "x-powered-by"

echo "Security header check passed."
