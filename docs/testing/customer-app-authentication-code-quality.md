# Customer App Authentication Code Quality

Run these checks for the module:

```bash
npm run typecheck -w apps/customer-app
npm run lint -w apps/customer-app
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run check:frontend-secrets
npm run check:secrets
```

## Additional Checks

- Confirm Customer App has no direct Axios import in auth screens
- Confirm `apps/customer-app/src/services/api/auth.api.ts` is the only Customer
  App auth API caller file
- Confirm the app builds or Metro starts without TypeScript errors
