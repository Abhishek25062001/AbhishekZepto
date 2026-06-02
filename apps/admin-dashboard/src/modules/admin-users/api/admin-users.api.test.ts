import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const apiSource = () => readFileSync(
  resolve(process.cwd(), 'src/modules/admin-users/api/admin-users.api.ts'),
  'utf8',
);

const hooksSource = () => readFileSync(
  resolve(process.cwd(), 'src/modules/admin-users/hooks/useAdminUserMutations.ts'),
  'utf8',
);

test('admin users API client uses existing Module 3 endpoints only', () => {
  const source = apiSource();

  assert.match(source, /const BASE = '\/api\/v1\/admin\/users'/);
  assert.match(source, /apiClient\.get<ApiSuccessResponse<AdminUserListResponse>>\(BASE/);
  assert.match(source, /apiClient\.post<ApiSuccessResponse<AdminUserSummary>>\(BASE, payload\)/);
  assert.match(source, /`\$\{BASE\}\/\$\{adminUserId\}`/);
  assert.match(source, /`\$\{BASE\}\/\$\{adminUserId\}\/status`/);
  assert.match(source, /`\$\{BASE\}\/\$\{adminUserId\}\/roles`/);
  assert.match(source, /`\$\{BASE\}\/\$\{adminUserId\}\/permissions`/);
  assert.match(source, /`\$\{BASE\}\/\$\{adminUserId\}\/audit`/);
});

test('admin user mutations refresh list detail and audit query keys', () => {
  const source = hooksSource();

  assert.match(source, /invalidateQueries\(\{ queryKey: adminUsersQueryKeys\.all \}\)/);
  assert.match(source, /invalidateQueries\(\{ queryKey: adminUsersQueryKeys\.detail\(adminUserId\) \}\)/);
  assert.match(source, /invalidateQueries\(\{ queryKey: adminUsersQueryKeys\.audit\(adminUserId\) \}\)/);
});

test('admin users list page wires documented filters and pagination', () => {
  const pageSource = readFileSync(resolve(process.cwd(), 'src/pages/users/UsersPage.tsx'), 'utf8');
  const filterSource = readFileSync(
    resolve(process.cwd(), 'src/modules/admin-users/components/AdminUsersFilterBar.tsx'),
    'utf8',
  );

  assert.match(pageSource, /useAdminUsers\(filters\)/);
  assert.match(pageSource, /page: 1, limit: 20/);
  assert.match(pageSource, /pagination\.hasPreviousPage/);
  assert.match(pageSource, /pagination\.hasNextPage/);
  assert.match(filterSource, /role:/);
  assert.match(filterSource, /status:/);
  assert.match(filterSource, /cityId:/);
  assert.match(filterSource, /search:/);
});

test('create admin user UI is permission gated and submits create payload only', () => {
  const pageSource = readFileSync(resolve(process.cwd(), 'src/pages/users/UsersPage.tsx'), 'utf8');
  const modalSource = readFileSync(
    resolve(process.cwd(), 'src/modules/admin-users/components/CreateAdminUserModal.tsx'),
    'utf8',
  );

  assert.match(pageSource, /ADMIN_USER_CREATE_PERMISSIONS = \['users:create', 'settings:manage'\]/);
  assert.match(pageSource, /<CreateAdminUserModal/);
  assert.match(modalSource, /useCreateAdminUserMutation/);
  assert.match(modalSource, /createAdminUserFormSchema\.safeParse\(values\)/);
  assert.match(modalSource, /mutation\.mutate\(payload/);
  assert.doesNotMatch(modalSource, /reason/);
});

test('admin user detail route fetches detail and audit endpoints', () => {
  const routesSource = readFileSync(resolve(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
  const detailSource = readFileSync(resolve(process.cwd(), 'src/pages/users/AdminUserDetailPage.tsx'), 'utf8');
  const tableSource = readFileSync(
    resolve(process.cwd(), 'src/modules/admin-users/components/AdminUserAuditTable.tsx'),
    'utf8',
  );

  assert.match(routesSource, /path: '\/users\/:adminUserId'/);
  assert.match(routesSource, /permission="users:read"/);
  assert.match(detailSource, /useAdminUserDetail\(adminUserId\)/);
  assert.match(detailSource, /useAdminUserAudit\(adminUserId\)/);
  assert.match(tableSource, /No admin user audit records found/);
});

test('admin user profile update UI uses only profile metadata endpoint', () => {
  const detailSource = readFileSync(resolve(process.cwd(), 'src/pages/users/AdminUserDetailPage.tsx'), 'utf8');
  const modalSource = readFileSync(
    resolve(process.cwd(), 'src/modules/admin-users/components/EditAdminUserModal.tsx'),
    'utf8',
  );

  assert.match(detailSource, /ADMIN_USER_UPDATE_PERMISSIONS = \['users:update', 'settings:manage'\]/);
  assert.match(detailSource, /<EditAdminUserModal/);
  assert.match(modalSource, /useUpdateAdminUserMutation\(user\.adminUserId\)/);
  assert.match(modalSource, /updateAdminUserFormSchema\.safeParse\(values\)/);
  assert.match(modalSource, /name: parsed\.data\.name/);
  assert.match(modalSource, /cityScope: parsed\.data\.cityScope/);
  assert.doesNotMatch(modalSource, /status:/);
  assert.doesNotMatch(modalSource, /role:/);
  assert.doesNotMatch(modalSource, /permissions:/);
  assert.doesNotMatch(modalSource, /reason/);
});

test('admin user status control is permission gated and requires reason', () => {
  const detailSource = readFileSync(resolve(process.cwd(), 'src/pages/users/AdminUserDetailPage.tsx'), 'utf8');
  const statusSource = readFileSync(
    resolve(process.cwd(), 'src/modules/admin-users/components/AdminUserStatusControl.tsx'),
    'utf8',
  );

  assert.match(detailSource, /ADMIN_USER_STATUS_PERMISSIONS = \['users:update-status', 'settings:manage'\]/);
  assert.match(detailSource, /<AdminUserStatusControl/);
  assert.match(statusSource, /useUpdateAdminUserStatusMutation\(user\.adminUserId\)/);
  assert.match(statusSource, /adminUserStatusFormSchema\.safeParse\(values\)/);
  assert.match(statusSource, /status: parsed\.data\.status/);
  assert.match(statusSource, /reason: parsed\.data\.reason/);
  assert.doesNotMatch(statusSource, /role:/);
  assert.doesNotMatch(statusSource, /permissions:/);
});

test('admin user role and direct permission controls require settings manage and reason', () => {
  const detailSource = readFileSync(resolve(process.cwd(), 'src/pages/users/AdminUserDetailPage.tsx'), 'utf8');
  const roleSource = readFileSync(
    resolve(process.cwd(), 'src/modules/admin-users/components/AdminUserRoleControl.tsx'),
    'utf8',
  );
  const permissionsSource = readFileSync(
    resolve(process.cwd(), 'src/modules/admin-users/components/AdminUserPermissionsControl.tsx'),
    'utf8',
  );

  assert.match(detailSource, /ADMIN_USER_SETTINGS_PERMISSIONS = \['settings:manage'\]/);
  assert.match(detailSource, /<AdminUserRoleControl/);
  assert.match(detailSource, /<AdminUserPermissionsControl/);
  assert.match(roleSource, /useUpdateAdminUserRoleMutation\(user\.adminUserId\)/);
  assert.match(roleSource, /adminUserRoleFormSchema\.safeParse\(values\)/);
  assert.match(roleSource, /role: parsed\.data\.role/);
  assert.match(roleSource, /reason: parsed\.data\.reason/);
  assert.match(permissionsSource, /useUpdateAdminUserPermissionsMutation\(user\.adminUserId\)/);
  assert.match(permissionsSource, /adminUserPermissionsFormSchema\.safeParse\(values\)/);
  assert.match(permissionsSource, /permissions: parsed\.data\.permissions/);
  assert.match(permissionsSource, /reason: parsed\.data\.reason/);
});

test('admin user mutation dialogs expose errors and lock form fields while pending', () => {
  const mutationDialogFiles = [
    'CreateAdminUserModal.tsx',
    'EditAdminUserModal.tsx',
    'AdminUserStatusControl.tsx',
    'AdminUserRoleControl.tsx',
    'AdminUserPermissionsControl.tsx',
  ];

  for (const fileName of mutationDialogFiles) {
    const source = readFileSync(
      resolve(process.cwd(), `src/modules/admin-users/components/${fileName}`),
      'utf8',
    );
    assert.match(source, /role="alert"/);
    assert.match(source, /disabled=\{mutation\.isPending\}/);
    assert.match(source, /getApiErrorMessage/);
  }
});
