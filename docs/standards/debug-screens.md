# Debug Screen Foundation

Phase 1 debug screens are local development placeholders for checking runtime
configuration and backend reachability.

## Web

- Vendor panel exposes `/debug` only when `APP_ENV` is `development`.
- Admin dashboard exposes `/debug` only when `APP_ENV` is `development`.
- Debug pages display the frontend environment, API base URL, and backend health
  status from `GET /api/v1/public/health`.

## Mobile

- Customer app registers a `Debug` screen only when `APP_ENV` is `development`.
- Delivery agent app registers a `Debug` screen only when `APP_ENV` is
  `development`.
- Debug screens display the frontend environment, API base URL, and backend
  health status from `GET /api/v1/public/health`.

## Exclusions

- Phase 1 does not add remote crash reporting, analytics dashboards, or
  production debug routes.
- Phase 1 debug screens must not display secrets, auth tokens, cookies, or
  personally identifiable data.
