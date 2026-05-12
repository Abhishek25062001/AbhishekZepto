#!/bin/sh
set -eu

missing=0

check_file() {
  file_path="$1"

  if [ ! -f "$file_path" ]; then
    echo "Missing env file: $file_path"
    missing=1
  fi
}

check_file "backend/api/.env"
check_file "apps/customer-app/.env"
check_file "apps/delivery-agent-app/.env"
check_file "apps/vendor-panel/.env"
check_file "apps/admin-dashboard/.env"

if [ "$missing" -eq 0 ]; then
  echo "All required local env files exist."
  exit 0
fi

echo "Create missing files from the matching .env.example files and add safe local values."
exit 1
