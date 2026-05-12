#!/bin/sh

set -eu

API_BASE_URL="${API_BASE_URL:-http://localhost:5000}"
HEALTH_URL="$API_BASE_URL/api/v1/public/health"

check_allowed_origin() {
  origin="$1"

  response="$(
    curl -s -i -X OPTIONS "$HEALTH_URL" \
      -H "Origin: $origin" \
      -H "Access-Control-Request-Method: GET" || true
  )"

  if [ -z "$response" ]; then
    echo "CORS check failed: no response from $HEALTH_URL"
    exit 1
  fi

  if echo "$response" | tr '[:upper:]' '[:lower:]' | rg -q "^access-control-allow-origin: $(echo "$origin" | tr '[:upper:]' '[:lower:]')"; then
    echo "PASS allowed origin $origin"
    return
  fi

  echo "FAIL allowed origin $origin was not echoed"
  exit 1
}

check_blocked_origin() {
  origin="$1"

  response="$(
    curl -s -i -X OPTIONS "$HEALTH_URL" \
      -H "Origin: $origin" \
      -H "Access-Control-Request-Method: GET" || true
  )"

  if [ -z "$response" ]; then
    echo "CORS check failed: no response from $HEALTH_URL"
    exit 1
  fi

  if echo "$response" | tr '[:upper:]' '[:lower:]' | rg -q "^access-control-allow-origin: $(echo "$origin" | tr '[:upper:]' '[:lower:]')"; then
    echo "FAIL blocked origin $origin was echoed"
    exit 1
  fi

  echo "PASS blocked origin $origin"
}

check_allowed_origin "http://localhost:5173"
check_allowed_origin "http://localhost:5174"
check_blocked_origin "http://malicious.localhost"

echo "CORS check passed."
