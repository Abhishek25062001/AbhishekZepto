"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_test_1 = require("node:test");
const apiSource = () => (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/admin-users/api/admin-users.api.ts'), 'utf8');
const hooksSource = () => (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/admin-users/hooks/useAdminUserMutations.ts'), 'utf8');
(0, node_test_1.test)('admin users API client uses existing Module 3 endpoints only', () => {
    const source = apiSource();
    strict_1.default.match(source, /const BASE = '\/api\/v1\/admin\/users'/);
    strict_1.default.match(source, /apiClient\.get<ApiSuccessResponse<AdminUserListResponse>>\(BASE/);
    strict_1.default.match(source, /apiClient\.post<ApiSuccessResponse<AdminUserSummary>>\(BASE, payload\)/);
    strict_1.default.match(source, /`\$\{BASE\}\/\$\{adminUserId\}`/);
    strict_1.default.match(source, /`\$\{BASE\}\/\$\{adminUserId\}\/status`/);
    strict_1.default.match(source, /`\$\{BASE\}\/\$\{adminUserId\}\/roles`/);
    strict_1.default.match(source, /`\$\{BASE\}\/\$\{adminUserId\}\/permissions`/);
    strict_1.default.match(source, /`\$\{BASE\}\/\$\{adminUserId\}\/audit`/);
});
(0, node_test_1.test)('admin user mutations refresh list detail and audit query keys', () => {
    const source = hooksSource();
    strict_1.default.match(source, /invalidateQueries\(\{ queryKey: adminUsersQueryKeys\.all \}\)/);
    strict_1.default.match(source, /invalidateQueries\(\{ queryKey: adminUsersQueryKeys\.detail\(adminUserId\) \}\)/);
    strict_1.default.match(source, /invalidateQueries\(\{ queryKey: adminUsersQueryKeys\.audit\(adminUserId\) \}\)/);
});
(0, node_test_1.test)('admin users list page wires documented filters and pagination', () => {
    const pageSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/pages/users/UsersPage.tsx'), 'utf8');
    const filterSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/admin-users/components/AdminUsersFilterBar.tsx'), 'utf8');
    strict_1.default.match(pageSource, /useAdminUsers\(filters\)/);
    strict_1.default.match(pageSource, /page: 1, limit: 20/);
    strict_1.default.match(pageSource, /pagination\.hasPreviousPage/);
    strict_1.default.match(pageSource, /pagination\.hasNextPage/);
    strict_1.default.match(filterSource, /role:/);
    strict_1.default.match(filterSource, /status:/);
    strict_1.default.match(filterSource, /cityId:/);
    strict_1.default.match(filterSource, /search:/);
});
(0, node_test_1.test)('create admin user UI is permission gated and submits create payload only', () => {
    const pageSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/pages/users/UsersPage.tsx'), 'utf8');
    const modalSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/admin-users/components/CreateAdminUserModal.tsx'), 'utf8');
    strict_1.default.match(pageSource, /ADMIN_USER_CREATE_PERMISSIONS = \['users:create', 'settings:manage'\]/);
    strict_1.default.match(pageSource, /<CreateAdminUserModal/);
    strict_1.default.match(modalSource, /useCreateAdminUserMutation/);
    strict_1.default.match(modalSource, /createAdminUserFormSchema\.safeParse\(values\)/);
    strict_1.default.match(modalSource, /mutation\.mutate\(payload/);
    strict_1.default.doesNotMatch(modalSource, /reason/);
});
(0, node_test_1.test)('admin user detail route fetches detail and audit endpoints', () => {
    const routesSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/routes/admin.routes.tsx'), 'utf8');
    const detailSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/pages/users/AdminUserDetailPage.tsx'), 'utf8');
    const tableSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/admin-users/components/AdminUserAuditTable.tsx'), 'utf8');
    strict_1.default.match(routesSource, /path: '\/users\/:adminUserId'/);
    strict_1.default.match(routesSource, /permission="users:read"/);
    strict_1.default.match(detailSource, /useAdminUserDetail\(adminUserId\)/);
    strict_1.default.match(detailSource, /useAdminUserAudit\(adminUserId\)/);
    strict_1.default.match(tableSource, /No admin user audit records found/);
});
(0, node_test_1.test)('admin user profile update UI uses only profile metadata endpoint', () => {
    const detailSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/pages/users/AdminUserDetailPage.tsx'), 'utf8');
    const modalSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/admin-users/components/EditAdminUserModal.tsx'), 'utf8');
    strict_1.default.match(detailSource, /ADMIN_USER_UPDATE_PERMISSIONS = \['users:update', 'settings:manage'\]/);
    strict_1.default.match(detailSource, /<EditAdminUserModal/);
    strict_1.default.match(modalSource, /useUpdateAdminUserMutation\(user\.adminUserId\)/);
    strict_1.default.match(modalSource, /updateAdminUserFormSchema\.safeParse\(values\)/);
    strict_1.default.match(modalSource, /name: parsed\.data\.name/);
    strict_1.default.match(modalSource, /cityScope: parsed\.data\.cityScope/);
    strict_1.default.doesNotMatch(modalSource, /status:/);
    strict_1.default.doesNotMatch(modalSource, /role:/);
    strict_1.default.doesNotMatch(modalSource, /permissions:/);
    strict_1.default.doesNotMatch(modalSource, /reason/);
});
(0, node_test_1.test)('admin user status control is permission gated and requires reason', () => {
    const detailSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/pages/users/AdminUserDetailPage.tsx'), 'utf8');
    const statusSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/admin-users/components/AdminUserStatusControl.tsx'), 'utf8');
    strict_1.default.match(detailSource, /ADMIN_USER_STATUS_PERMISSIONS = \['users:update-status', 'settings:manage'\]/);
    strict_1.default.match(detailSource, /<AdminUserStatusControl/);
    strict_1.default.match(statusSource, /useUpdateAdminUserStatusMutation\(user\.adminUserId\)/);
    strict_1.default.match(statusSource, /adminUserStatusFormSchema\.safeParse\(values\)/);
    strict_1.default.match(statusSource, /status: parsed\.data\.status/);
    strict_1.default.match(statusSource, /reason: parsed\.data\.reason/);
    strict_1.default.doesNotMatch(statusSource, /role:/);
    strict_1.default.doesNotMatch(statusSource, /permissions:/);
});
(0, node_test_1.test)('admin user role and direct permission controls require settings manage and reason', () => {
    const detailSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/pages/users/AdminUserDetailPage.tsx'), 'utf8');
    const roleSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/admin-users/components/AdminUserRoleControl.tsx'), 'utf8');
    const permissionsSource = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), 'src/modules/admin-users/components/AdminUserPermissionsControl.tsx'), 'utf8');
    strict_1.default.match(detailSource, /ADMIN_USER_SETTINGS_PERMISSIONS = \['settings:manage'\]/);
    strict_1.default.match(detailSource, /<AdminUserRoleControl/);
    strict_1.default.match(detailSource, /<AdminUserPermissionsControl/);
    strict_1.default.match(roleSource, /useUpdateAdminUserRoleMutation\(user\.adminUserId\)/);
    strict_1.default.match(roleSource, /adminUserRoleFormSchema\.safeParse\(values\)/);
    strict_1.default.match(roleSource, /role: parsed\.data\.role/);
    strict_1.default.match(roleSource, /reason: parsed\.data\.reason/);
    strict_1.default.match(permissionsSource, /useUpdateAdminUserPermissionsMutation\(user\.adminUserId\)/);
    strict_1.default.match(permissionsSource, /adminUserPermissionsFormSchema\.safeParse\(values\)/);
    strict_1.default.match(permissionsSource, /permissions: parsed\.data\.permissions/);
    strict_1.default.match(permissionsSource, /reason: parsed\.data\.reason/);
});
(0, node_test_1.test)('admin user mutation dialogs expose errors and lock form fields while pending', () => {
    const mutationDialogFiles = [
        'CreateAdminUserModal.tsx',
        'EditAdminUserModal.tsx',
        'AdminUserStatusControl.tsx',
        'AdminUserRoleControl.tsx',
        'AdminUserPermissionsControl.tsx',
    ];
    for (const fileName of mutationDialogFiles) {
        const source = (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(process.cwd(), `src/modules/admin-users/components/${fileName}`), 'utf8');
        strict_1.default.match(source, /role="alert"/);
        strict_1.default.match(source, /disabled=\{mutation\.isPending\}/);
        strict_1.default.match(source, /getApiErrorMessage/);
    }
});
