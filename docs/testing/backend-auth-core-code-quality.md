# Backend Auth Core Code Quality

## Goal

Document the planned code-quality verification for Backend Auth Core.

## Commands

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test -w backend/api` if test setup exists
- `npm run check:secrets`

## Logging Checks

Confirm auth logs do not print:

- `otp`
- `otpHash`
- `accessToken`
- `refreshToken`
- `refreshTokenHash`

Confirm request logger redacts:

- `authorization`
- `otp`
- `accessToken`
- `refreshToken`
- `token`

## Docs Endpoints

- Confirm OpenAPI JSON loads:
  `curl http://localhost:5000/api/v1/public/openapi.json`
- Confirm Swagger docs load in non-production:
  `curl http://localhost:5000/api/v1/public/docs`
