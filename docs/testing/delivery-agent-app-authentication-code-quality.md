# Delivery Agent App Authentication Code Quality

Run these checks for the module:

```bash
npm run typecheck -w apps/delivery-agent-app
npm run lint -w apps/delivery-agent-app
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run check:frontend-secrets
npm run check:secrets
```

## Additional Checks

- Confirm Delivery Agent App has no direct Axios import in auth screens
- Confirm `apps/delivery-agent-app/src/services/api/auth.api.ts` is the only
  Delivery Agent App auth API caller file
- Confirm the app builds or Metro starts without TypeScript errors
