# Local Environment Files

## Required Local Env Files

Create these real local files by copying the matching `.env.example` files:

```text
backend/api/.env
apps/customer-app/.env
apps/delivery-agent-app/.env
apps/vendor-panel/.env
apps/admin-dashboard/.env
```

Real `.env` files are ignored by Git. Do not commit secrets, database
credentials, API keys, OTP values, JWT secrets, provider credentials, or
production connection strings.

## Example Files

Committed example files:

```text
.env.example
backend/api/.env.example
apps/customer-app/.env.example
apps/delivery-agent-app/.env.example
apps/vendor-panel/.env.example
apps/admin-dashboard/.env.example
```

## Backend Local Values

Minimum backend local values:

```text
APP_ENV=development
APP_PORT=5000
APP_VERSION=1.0.0
DB_MONGO_URI=mongodb://localhost:27017/zepto_like_dev
```

`REDIS_URL`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` remain placeholders
until their owning modules implement real behavior.

## Frontend Local Values

Mobile apps use:

```text
API_BASE_URL=http://localhost:5000
APP_ENV=development
```

Web panels use:

```text
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_ENV=development
```

For an Android emulator, use `http://10.0.2.2:5000` when the backend runs on the
host machine.

## Env File Check

Run this helper from the repository root:

```bash
sh scripts/check-env-files.sh
```

The script is committed with execute permission. If local permissions are lost,
restore them with:

```bash
chmod +x scripts/check-env-files.sh
```

If it reports missing files, copy each matching `.env.example` and then fill in
safe local values. The helper does not print secret values.
