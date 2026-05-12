# User Identity Contract

## Contract Goal

Document the user identity response shape for internal backend usage.

## Collection

- `user_identities`

## Planned Model Path

- `/backend/api/src/modules/auth/models/user-identity.model.ts`

## Internal User Identity Shape

```ts
type UserIdentityContract = {
  id: string;
  phone: string;
  email: string | null;
  name: string | null;
  role: AuthRole;
  accountStatus:
    | 'active'
    | 'inactive'
    | 'blocked'
    | 'suspended'
    | 'pending_approval'
    | 'deleted';
  permissions: string[];
  vendorId: string | null;
  storeId: string | null;
  cityId: string | null;
  lastLoginAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  status: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
```

## API Endpoints

No new API endpoints created in this task.

## DB Fields

- `user_identities.phone`
- `user_identities.email`
- `user_identities.name`
- `user_identities.role`
- `user_identities.accountStatus`
- `user_identities.permissions`
- `user_identities.vendorId`
- `user_identities.storeId`
- `user_identities.cityId`
- `user_identities.lastLoginAt`
- `user_identities.createdBy`
- `user_identities.updatedBy`
- `user_identities.status`
- `user_identities.isDeleted`
- `user_identities.deletedAt`
- `user_identities.createdAt`
- `user_identities.updatedAt`
