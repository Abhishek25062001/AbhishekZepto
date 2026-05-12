#!/bin/sh

set -eu

echo "Checking frontend source for forbidden secret names..."

matches="$(
  rg -n \
    -e 'JWT_ACCESS_SECRET' \
    -e 'JWT_REFRESH_SECRET' \
    -e 'DB_MONGO_URI' \
    -e 'REDIS_URL' \
    -e 'RAZORPAY_SECRET' \
    -e 'FCM_PRIVATE_KEY' \
    apps/customer-app/src \
    apps/delivery-agent-app/src \
    apps/vendor-panel/src \
    apps/admin-dashboard/src \
    | cut -d ':' -f 1 | sort -u || true
)"

if [ -n "$matches" ]; then
  echo "Forbidden frontend secret names found in:"
  echo "$matches"
  exit 1
fi

echo "Frontend secret check passed."
