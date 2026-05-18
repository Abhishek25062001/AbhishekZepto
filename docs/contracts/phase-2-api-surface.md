# Phase 2 API Surface

## Public Auth Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## Surface Permission Endpoints

- `GET /api/v1/customer/me/permissions`
- `GET /api/v1/delivery/me/permissions`
- `GET /api/v1/vendor/me/permissions`
- `GET /api/v1/admin/me/permissions`

## Session Management Endpoints

- `GET /api/v1/auth/me/sessions`
- `POST /api/v1/auth/logout-session`
- `POST /api/v1/auth/logout-other-sessions`

Current corrective decision:

- these generic `/api/v1/auth/*` routes are the current implemented Phase 2
  self-session contract
- source-document per-surface routes such as `/api/v1/customer/me/sessions` and
  `/api/v1/admin/me/sessions` are not currently implemented
- any admin user-session route family remains `NEEDS VERIFICATION`

## Internal Verification Endpoints

- `GET /api/v1/internal/auth/test-protected`
- `GET /api/v1/internal/auth/test-vendor-scope`
- `GET /api/v1/internal/auth/test-store-scope`
- `GET /api/v1/internal/auth/test-city-scope`
- `GET /api/v1/internal/auth/test-session-list`
- `POST /api/v1/internal/auth/test-session-revoke`

## Notes

- Internal verification routes exist for manual Phase 2 checks and are not
  business-user-facing APIs.
