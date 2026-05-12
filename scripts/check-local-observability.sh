#!/bin/sh
set -eu

API_BASE_URL="${API_BASE_URL:-http://localhost:5000}"
HEALTH_URL="$API_BASE_URL/api/v1/public/health"

echo "Running backend health check..."
sh scripts/check-backend-health.sh

echo "Running backend system-info check..."
sh scripts/check-backend-system-info.sh

health_response="$(curl -sS "$HEALTH_URL")"

echo "MongoDB status:"
HEALTH_RESPONSE="$health_response" node -e "const response = JSON.parse(process.env.HEALTH_RESPONSE || '{}'); console.log(response.data?.database?.status || 'unknown');"

echo "Redis placeholder status:"
HEALTH_RESPONSE="$health_response" node -e "const response = JSON.parse(process.env.HEALTH_RESPONSE || '{}'); console.log(response.data?.redis?.status || 'unknown');"
