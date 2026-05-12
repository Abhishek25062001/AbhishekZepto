# Backend Auth Core User Identity Repository

## Goal

Document the planned user identity repository updates for Backend Auth Core.

## Planned File Path

- `/backend/api/src/modules/auth/repositories/user-identity.repository.ts`

## Existing Functions To Confirm

- `findUserIdentityById()`
- `findUserIdentityByPhoneAndRole()`
- `createUserIdentity()`
- `updateLastLoginAt()`

## Required Updates

### findUserIdentityById()

- Exclude `isDeleted: true`

### findUserIdentityByPhoneAndRole()

Filter by:

- `phone`
- `role`
- `isDeleted: false`

### findActiveUserIdentityById()

Filter by:

- `_id`
- `isDeleted: false`
- `accountStatus: 'active'`

### updateLastLoginAt()

- Set `lastLoginAt: new Date()`

### canUserLogin(user)

Return `false` for:

- `inactive`
- `blocked`
- `suspended`
- `pending_approval`
- `deleted`
