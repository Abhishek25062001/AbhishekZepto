# React Native Foundation Handoff

## Module

Phase 1, Module 6: Frontend Foundation — React Native Apps.

## Status

Completed.

## Completed Tickets

1. Shared React Native app architecture pattern.
2. Customer App navigation foundation.
3. Delivery Agent App navigation foundation.
4. Customer App mobile API client foundation.
5. Delivery Agent App mobile API client foundation.
6. Customer App state and query foundation.
7. Delivery Agent App state and query foundation.
8. Customer App secure local storage foundation.
9. Delivery Agent App secure local storage foundation.
10. Mobile auth session restore placeholders.
11. Customer App common UI components.
12. Delivery Agent App common UI components.
13. Customer App backend health connection.
14. Delivery Agent App backend health connection.
15. Mobile app error handling foundation.
16. React Native Foundation verification and handoff.

## Created Customer App Files

```text
apps/customer-app/App.tsx
apps/customer-app/eslint.config.mjs
apps/customer-app/metro.config.js
apps/customer-app/src/app/AppNavigator.tsx
apps/customer-app/src/app/AuthNavigator.tsx
apps/customer-app/src/app/MainNavigator.tsx
apps/customer-app/src/app/navigation.types.ts
apps/customer-app/src/components/common/Button.tsx
apps/customer-app/src/components/common/EmptyState.tsx
apps/customer-app/src/components/common/ErrorBoundary.tsx
apps/customer-app/src/components/common/ErrorView.tsx
apps/customer-app/src/components/common/Input.tsx
apps/customer-app/src/components/common/Loader.tsx
apps/customer-app/src/components/common/ScreenWrapper.tsx
apps/customer-app/src/components/common/index.ts
apps/customer-app/src/config/env.ts
apps/customer-app/src/constants/storage-keys.ts
apps/customer-app/src/hooks/useAppNavigation.ts
apps/customer-app/src/hooks/useBackendHealth.ts
apps/customer-app/src/hooks/useRestoreCustomerSession.ts
apps/customer-app/src/screens/SplashScreen.tsx
apps/customer-app/src/screens/auth/LoginScreen.tsx
apps/customer-app/src/screens/main/HomeScreen.tsx
apps/customer-app/src/screens/main/ProfileScreen.tsx
apps/customer-app/src/services/api/client.ts
apps/customer-app/src/services/api/public.api.ts
apps/customer-app/src/services/auth/session-storage.service.ts
apps/customer-app/src/services/query/QueryProvider.tsx
apps/customer-app/src/services/storage/secure-storage.service.ts
apps/customer-app/src/store/app.store.ts
apps/customer-app/src/store/auth.store.ts
apps/customer-app/src/types/api.types.ts
apps/customer-app/src/utils/error-message.util.ts
```

## Created Delivery Agent App Files

```text
apps/delivery-agent-app/App.tsx
apps/delivery-agent-app/eslint.config.mjs
apps/delivery-agent-app/metro.config.js
apps/delivery-agent-app/src/app/AppNavigator.tsx
apps/delivery-agent-app/src/app/AuthNavigator.tsx
apps/delivery-agent-app/src/app/MainNavigator.tsx
apps/delivery-agent-app/src/app/navigation.types.ts
apps/delivery-agent-app/src/components/common/Button.tsx
apps/delivery-agent-app/src/components/common/EmptyState.tsx
apps/delivery-agent-app/src/components/common/ErrorBoundary.tsx
apps/delivery-agent-app/src/components/common/ErrorView.tsx
apps/delivery-agent-app/src/components/common/Input.tsx
apps/delivery-agent-app/src/components/common/Loader.tsx
apps/delivery-agent-app/src/components/common/ScreenWrapper.tsx
apps/delivery-agent-app/src/components/common/index.ts
apps/delivery-agent-app/src/config/env.ts
apps/delivery-agent-app/src/constants/storage-keys.ts
apps/delivery-agent-app/src/hooks/useAppNavigation.ts
apps/delivery-agent-app/src/hooks/useBackendHealth.ts
apps/delivery-agent-app/src/hooks/useRestoreDeliverySession.ts
apps/delivery-agent-app/src/screens/SplashScreen.tsx
apps/delivery-agent-app/src/screens/auth/LoginScreen.tsx
apps/delivery-agent-app/src/screens/main/ActiveDeliveryScreen.tsx
apps/delivery-agent-app/src/screens/main/DeliveryHomeScreen.tsx
apps/delivery-agent-app/src/screens/main/ProfileScreen.tsx
apps/delivery-agent-app/src/services/api/client.ts
apps/delivery-agent-app/src/services/api/public.api.ts
apps/delivery-agent-app/src/services/auth/session-storage.service.ts
apps/delivery-agent-app/src/services/query/QueryProvider.tsx
apps/delivery-agent-app/src/services/storage/secure-storage.service.ts
apps/delivery-agent-app/src/store/auth.store.ts
apps/delivery-agent-app/src/store/delivery.store.ts
apps/delivery-agent-app/src/types/api.types.ts
apps/delivery-agent-app/src/utils/error-message.util.ts
```

## Created Docs

```text
docs/architecture/mobile-session-restore.md
docs/architecture/react-native-app-architecture.md
docs/contracts/mobile-public-api-contract.md
docs/handoffs/customer-app-navigation-foundation.md
docs/handoffs/delivery-agent-app-navigation-foundation.md
docs/handoffs/mobile-backend-health-connection.md
docs/standards/mobile-api-usage.md
docs/standards/mobile-error-handling.md
docs/standards/mobile-secure-storage.md
docs/standards/mobile-state-management.md
docs/standards/mobile-ui-components.md
docs/standards/react-native-folder-conventions.md
```

## Connected Backend API Endpoints

```http
GET /api/v1/public/health
GET /api/v1/public/version
GET /api/v1/public/system-info
```

## Customer App Local State Fields

```text
accessToken
refreshToken
customerId
isAuthenticated
selectedAddressId
selectedStoreId
serviceableCityId
```

## Delivery Agent App Local State Fields

```text
accessToken
refreshToken
deliveryAgentId
isAuthenticated
availabilityStatus
currentOrderId
currentAssignmentId
currentDeliveryStatus
```

## Verification Results

Passed:

```bash
npm install
npm run typecheck -w apps/customer-app
npm run typecheck -w apps/delivery-agent-app
npm run lint -w apps/customer-app
npm run lint -w apps/delivery-agent-app
APP_PORT=5010 npm run dev -w backend/api
curl http://localhost:5010/api/v1/public/health
API_BASE_URL=http://localhost:5010 npm run start -w apps/customer-app -- --port 8081
API_BASE_URL=http://localhost:5010 npm run start -w apps/delivery-agent-app -- --port 8082
```

Backend health returned HTTP `200` with the standard success envelope.

Customer Metro started successfully on port `8081`.

Delivery Agent Metro started successfully on port `8082`.

Route behavior was verified from code paths:

- both apps show `SplashScreen` while session restore starts with
  `isRestoringSession: true`
- both apps route to auth/login when no stored tokens exist
- both apps route to main screens after the auth store receives a placeholder
  session through `setAuthSession()`

No device or simulator launch was performed in this module because native
Android/iOS project files were not part of the Phase 1 React Native Foundation
micro-tasks.

## Known Pending Items

- Real OTP login screens will be implemented in Phase 2.
- Real token refresh will be implemented in Phase 2.
- Customer catalog screens will be implemented in Phase 3 and Phase 4.
- Delivery assignment and active delivery workflows will be implemented in
  Phase 6.
- Push notifications and socket tracking will be implemented in Phase 7.
- Native Android/iOS project generation and device builds are not part of this
  module unless a later module explicitly introduces them.

## Required Credentials And Env Values For Next Task

No new secrets, API keys, webhook secrets, provider configs, or credentials were
discovered.

Mobile runtime values:

| Variable | Purpose | Expected format/example without real secrets | Where to add it | Next task blocked without it |
| --- | --- | --- | --- | --- |
| `API_BASE_URL` | Backend API base URL for mobile API clients | `http://localhost:5000` or `http://localhost:5010` | `apps/customer-app/.env`, `apps/delivery-agent-app/.env`, or local shell env | Yes, for mobile backend API calls |
| `APP_ENV` | Mobile runtime mode and development-only health display | `development` | `apps/customer-app/.env`, `apps/delivery-agent-app/.env`, or local shell env | No, defaults to `development` |

