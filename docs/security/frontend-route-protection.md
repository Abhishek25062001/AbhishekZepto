# Frontend Route Protection

## Frontend Route Protection Goal

Frontend route protection exists for user experience only. Backend
authorization remains the final authority for every protected operation.

## Vendor Panel Protected Routes

- `/dashboard`
- `/orders`
- `/inventory`
- `/products`
- `/settings`
- `/debug`

Unauthenticated users redirect to `/login`.

## Admin Dashboard Protected Routes

- `/dashboard`
- `/users`
- `/stores`
- `/products`
- `/orders`
- `/delivery-agents`
- `/finance`
- `/support`
- `/settings`
- `/debug`

Unauthenticated users redirect to `/login`.

## Customer App Protected Screens

- `Home`
- `Profile`
- `Debug`

Unauthenticated users can only access the auth navigator.

## Delivery Agent App Protected Screens

- `DeliveryHome`
- `ActiveDelivery`
- `Profile`
- `Debug`

Unauthenticated users can only access the auth navigator.

## API Endpoints

No new API endpoints created in this task.

## DB Fields

No new database fields created in this task.
