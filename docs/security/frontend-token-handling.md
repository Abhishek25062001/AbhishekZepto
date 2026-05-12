# Frontend Token Handling

## Mobile Token Storage

Customer App and Delivery Agent App must store tokens using secure storage only.

Customer App token storage keys:

- `customer_access_token`
- `customer_refresh_token`
- `customer_id`

Delivery Agent App token storage keys:

- `delivery_access_token`
- `delivery_refresh_token`
- `delivery_agent_id`

## Web Token Storage

Phase 1 web token storage is a placeholder implemented in browser local storage
for Vendor Panel and Admin Dashboard foundations.

Production hardening may move web refresh token handling to a secure HTTP-only
cookie strategy.

## Logging Rule

Frontend storage services must never log token values. Frontend API debug logs
must redact:

- `Authorization`
- `accessToken`
- `refreshToken`

## API Endpoints

No new API endpoints created in this task.

## DB Fields

No new database fields created in this task.
