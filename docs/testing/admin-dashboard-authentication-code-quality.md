# Admin Dashboard Authentication Code Quality

## Required Checks

- `npm run typecheck -w apps/admin-dashboard`
- `npm run lint -w apps/admin-dashboard`
- `npm run build -w apps/admin-dashboard`
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run build -w backend/api`
- `npm run check:frontend-secrets`
- `npm run check:secrets`

## Guardrail

- Auth pages must not call Axios directly
