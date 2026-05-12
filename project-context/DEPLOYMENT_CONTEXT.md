# Deployment Context

## Current State

Production deployment infrastructure is not implemented yet.

There is no confirmed CI/CD, staging, production hosting, secret manager,
monitoring stack, or deployment pipeline in the current repository. Module 10
has local-development setup documentation and local Docker backend services for
MongoDB plus the backend API. Production-grade deployment remains deferred.
Module 11 added local logging, monitoring, tracing, observability checks, and
debug placeholders only; production monitoring providers remain deferred.
Module 12 added local security middleware, verification scripts, dependency
audit scripts, and audit logging foundation only; production WAF, secret
manager, and penetration testing remain deferred.

## Environments

Approved environment names:

- `development`
- `staging`
- `production`

Backend `env.ts` also accepts `test` for test runtime support.

## Environment Files

Example files currently exist for the backend:

- `backend/api/.env.example`
- `backend/api/.env.development.example`
- `backend/api/.env.staging.example`
- `backend/api/.env.production.example`

Root and app `.env.example` files also exist.

Real `.env` files must remain local and uncommitted.

## Current Backend Environment Variables

Backend startup currently requires:

| Variable | Required | Used by | Environments | Safe example |
| --- | --- | --- | --- | --- |
| `APP_ENV` | Yes | Backend config validation and runtime mode checks | local, staging, production, test | `development` |
| `APP_PORT` | Yes | Backend HTTP server port | local, staging, production, test | `5000` |
| `APP_VERSION` | Yes | Public version API response | local, staging, production, test | `1.0.0` |
| `DB_MONGO_URI` | Yes | MongoDB connection during backend startup, seed commands, and database health checks | local, staging, production, test | `mongodb://localhost:27017/zepto_like_dev` or `mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority` |
| `LOG_LEVEL` | No, defaults to `info` | Backend Pino logger verbosity | local, staging, production, test | `info` |
| `DEBUG_MODE` | No, defaults to `false` | Non-production safe debug helpers | local, staging, production, test | `false` |
| `ADMIN_WEB_ORIGIN` | No | CORS allowed Admin Dashboard origin | local, staging, production, test | `http://localhost:5174` |
| `VENDOR_WEB_ORIGIN` | No | CORS allowed Vendor Panel origin | local, staging, production, test | `http://localhost:5173` |

Backend placeholder variables that exist but are not yet implemented by their
owning modules:

| Variable | Current status | Future owner |
| --- | --- | --- |
| `REDIS_URL` | Placeholder only | Redis, queues, rate limiting, sessions, realtime |
| `JWT_ACCESS_SECRET` | Placeholder only | Future production JWT implementation |
| `JWT_REFRESH_SECRET` | Placeholder only | Future production JWT implementation |

Do not add real secrets to committed files. Add real local values only to a local
`.env` file or shell environment.

## Current Mobile Environment Variables

Customer App and Delivery Agent App example files include:

- `apps/customer-app/.env.example`
- `apps/delivery-agent-app/.env.example`

| Variable | Required | Used by | Environments | Safe example |
| --- | --- | --- | --- | --- |
| `API_BASE_URL` | Yes for backend API calls | Mobile Axios clients and backend health hooks | local, staging, production | `http://localhost:5000` |
| `APP_ENV` | No, defaults to `development` | Mobile runtime mode and development-only health display | local, staging, production | `development` |

## Current Web Panel Environment Variables

Vendor Panel and Admin Dashboard example files include:

- `apps/vendor-panel/.env.example`
- `apps/admin-dashboard/.env.example`

| Variable | Required | Used by | Environments | Safe example |
| --- | --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Yes for backend API calls | Web Axios clients and backend health hooks | local, staging, production | `http://localhost:5000` or `http://localhost:5010` |
| `VITE_APP_ENV` | No, defaults to `development` | Web runtime mode and development-only health display | local, staging, production | `development` |

## Backend Runtime

Backend dev command:

```bash
APP_ENV=development APP_PORT=5000 APP_VERSION=1.0.0 DB_MONGO_URI=mongodb://localhost:27017/zepto_like_dev npm run dev -w backend/api
```

Build command:

```bash
npm run build -w backend/api
```

Start command:

```bash
npm run start -w backend/api
```

Production runtime requires verified environment variables and compiled output.

## Runtime Requirements Discovered

Database Foundation connects to MongoDB before the backend starts listening.
The backend will fail startup if `DB_MONGO_URI` is missing or if MongoDB is not
reachable.

Runtime verification has passed against the approved safe MongoDB Atlas
development database configured in local `backend/api/.env`. The full Atlas URI
and credentials were not printed or documented.

Verified against the Atlas development database:

- backend MongoDB connection lifecycle
- `npm run seed -w backend/api`
- Authentication Foundation endpoint smoke tests on port `5010`
- seeded system role data

Port `5000` was already in use during verification, so port `5010` was used for
the local smoke-test server.

React Native Foundation verification also discovered the mobile apps need
React Native CLI and Metro config support for local Metro startup. These are now
declared in the Customer App and Delivery Agent App package files.

Verified mobile runtime commands:

```bash
API_BASE_URL=http://localhost:5010 npm run start -w apps/customer-app -- --port 8081
API_BASE_URL=http://localhost:5010 npm run start -w apps/delivery-agent-app -- --port 8082
```

No native Android/iOS project files were generated in this module.

Web Panels Foundation verification discovered:

- Vendor Panel and Admin Dashboard need Vite dev server localhost binding for local runtime smoke.
- Sandbox localhost binding required approved escalation during verification.
- Web runtime smoke passed after escalation on ports `5173` and `5174`.
- Backend live health smoke was blocked because MongoDB Atlas rejected the current network connection during backend startup.
- The observed backend failure indicated Atlas server selection failure and likely current IP/network access not being allowlisted. A TLS internal alert was also observed during server selection.
- No real MongoDB URI or password was printed or committed.

Verified web runtime commands:

```bash
VITE_API_BASE_URL=http://localhost:5010 npm run dev -w apps/vendor-panel -- --host 127.0.0.1 --port 5173
VITE_API_BASE_URL=http://localhost:5010 npm run dev -w apps/admin-dashboard -- --host 127.0.0.1 --port 5174
```

Shared UI & Design Foundation verification discovered no new environment
variables, credentials, API keys, webhook secrets, provider configs, or runtime
secrets. React Hook Form and Zod were added as frontend form foundation
dependencies. Local Metro and Vite startup checks used existing frontend API
base URL variables only.

Verified shared UI runtime commands:

```bash
API_BASE_URL=http://localhost:5010 npm run start -w apps/customer-app -- --port 8081
API_BASE_URL=http://localhost:5010 npm run start -w apps/delivery-agent-app -- --port 8082
VITE_API_BASE_URL=http://localhost:5010 npm run dev -w apps/vendor-panel -- --host 127.0.0.1 --port 5173
VITE_API_BASE_URL=http://localhost:5010 npm run dev -w apps/admin-dashboard -- --host 127.0.0.1 --port 5174
```

API Contract Foundation verification discovered no new environment variables,
credentials, API keys, webhook secrets, or provider configs. Swagger/OpenAPI
dependencies were added to the backend. The docs routes are exposed only when
`APP_ENV` is not `production`.

API Contract Foundation runtime smoke passed when MongoDB was reachable at
`DB_MONGO_URI` (local `backend/api/.env`). Ports `5000` and `5010` were already
in use during the successful continuation run, so the backend started on port
`5020`. Public health, version, system-info, Swagger docs redirect, OpenAPI JSON,
and `request-otp` validation failure smoke completed successfully. Customer and
Delivery Agent Metro startup passed with `API_BASE_URL=http://localhost:5020`;
Vendor Panel and Admin Dashboard Vite startup passed with
`VITE_API_BASE_URL=http://localhost:5020`. No MongoDB URI or password was
printed or committed.

Runtime command used:

```bash
APP_ENV=development APP_PORT=5020 APP_VERSION=1.0.0 npm run dev -w backend/api
```

Earlier attempts failed when MongoDB was not reachable from the current
machine or network (Atlas server selection or TLS errors, or local MongoDB not
running). Those cases still require Atlas Network Access for Atlas clusters, or
a running local MongoDB when using a local URI.

## Dependencies

Backend dependencies currently include:

- Express
- Mongoose
- Zod
- Helmet
- CORS
- dotenv
- Pino
- Pino HTTP
- Swagger JSDoc
- Swagger UI Express
- Pino Pretty for local backend log formatting

Redis, Socket.IO, BullMQ, payment SDKs, Firebase, map providers, media storage SDKs, production monitoring providers, production WAF, and production secret manager are not implemented yet.

## Current Docker Local Services

Local Docker backend services now exist for development only:

- `docker-compose.yml`
- `.dockerignore`
- `backend/api/Dockerfile`
- `docs/setup/docker-backend-services.md`

Compose services:

| Service | Purpose | Host port |
| --- | --- | ---: |
| `mongodb` | Local MongoDB required by backend startup | `27017` |
| `backend-api` | Existing Node.js Express backend API | `5000` |

The backend container uses:

```text
DB_MONGO_URI=mongodb://mongodb:27017/zepto_like_dev
```

No production secrets or deployment provider configuration were added.

Web panel dependencies currently include:

- React
- React DOM
- React Router DOM
- Axios
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Vite

Mobile app form foundation dependencies currently include:

- React Hook Form
- Zod

## Deferred Deployment Technology

Do not introduce Kubernetes, multi-region infrastructure, advanced monitoring, or production secret manager until a future phase explicitly requires it.

Docker local development support is implemented as Module 10 Ticket 2 from
`projectin micro/doctwo/PhaesDetail1&2.pdf` pages 194-198. Static Compose YAML
validation passed, but Docker runtime smoke is still pending in this environment
because the `docker` CLI is not installed. Production-grade deployment remains
deferred to later phases.

## Manual Verification Needed

- Target hosting provider.
- CI/CD provider.
- Container strategy.
- MongoDB hosting strategy.
- Redis hosting strategy.
- domain and TLS setup.
- staging and production secret management.
- monitoring and alerting stack.
- backup and restore strategy.

## Required credentials/env values for next task

| Variable or requirement | Purpose | Expected format/example without real secrets | Where to add it | Blocked without it |
| --- | --- | --- | --- | --- |
| `APP_ENV` | Backend runtime environment | `development` | Local shell env or `backend/api/.env` | Yes, for backend startup |
| `APP_PORT` | Backend HTTP port | `5000` or `5010` | Local shell env or `backend/api/.env` | Yes, for backend startup |
| `APP_VERSION` | Version returned by backend version API | `1.0.0` | Local shell env or `backend/api/.env` | Yes, for backend startup |
| `DB_MONGO_URI` | MongoDB connection string for backend startup, health DB status, seed command, and write-check endpoint | `mongodb://localhost:27017/zepto_like_dev` or `mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority` | Local shell env or `backend/api/.env` | Yes, for DB runtime verification |
| Running MongoDB service or Atlas development database | Database runtime needed by Database and Authentication Foundation verification | MongoDB reachable at the host or Atlas cluster used in `DB_MONGO_URI` | Local machine, safe Atlas development database, or future Docker setup | Yes, for DB runtime verification |
| Atlas current IP/network access | Allows Atlas SRV clusters to accept connections from this machine or network | Atlas Network Access allowlist entry for current public IP or approved development range | MongoDB Atlas dashboard | Yes, when `DB_MONGO_URI` points at Atlas and this network is not yet allowlisted |
| `API_BASE_URL` | Backend API base URL for mobile apps | `http://localhost:5000` or `http://localhost:5010` | `apps/customer-app/.env`, `apps/delivery-agent-app/.env`, or local shell env | Yes, for mobile backend API calls |
| Mobile `APP_ENV` | Mobile runtime mode and development-only health display | `development` | `apps/customer-app/.env`, `apps/delivery-agent-app/.env`, or local shell env | No, defaults to `development` |
| `VITE_API_BASE_URL` | Backend API base URL for Vendor Panel and Admin Dashboard | `http://localhost:5000` or `http://localhost:5010` | `apps/vendor-panel/.env`, `apps/admin-dashboard/.env`, or local shell env | Yes, for web backend API calls |
| `VITE_APP_ENV` | Web runtime mode and development-only health display | `development` | `apps/vendor-panel/.env`, `apps/admin-dashboard/.env`, or local shell env | No, defaults to `development` |

No new secret, API key, webhook secret, or provider credential was discovered during the Web Panels Foundation verification. Backend live smoke requires a reachable MongoDB at `DB_MONGO_URI` on the network that runs the backend (Atlas Network Access when using Atlas from a new IP, or a running local MongoDB when using a local URI).

No new secret, API key, webhook secret, provider credential, or environment
variable was discovered during the Shared UI & Design Foundation verification.

No new secret, API key, webhook secret, provider credential, or environment
variable was discovered during the API Contract Foundation verification. Backend
runtime smoke still depends on a reachable `DB_MONGO_URI` on whichever network
runs the check.

Module 11 added `LOG_LEVEL` and `DEBUG_MODE` backend environment knobs. No new
secret, API key, webhook secret, provider credential, production monitoring
token, or deployment credential was added. Local observability scripts require a
running backend at `API_BASE_URL`.

Module 12 added `ADMIN_WEB_ORIGIN` and `VENDOR_WEB_ORIGIN` backend CORS
environment knobs. No new secret, API key, webhook secret, provider credential,
or deployment credential was added. Security header and CORS scripts require a
running backend at `API_BASE_URL`.
