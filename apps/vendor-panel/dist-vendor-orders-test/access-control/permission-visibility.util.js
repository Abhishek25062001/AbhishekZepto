"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRenderAnyPermissionGatedContent = exports.shouldRenderPermissionGatedContent = void 0;
const shouldRenderPermissionGatedContent = (permissions, requiredPermission) => permissions.includes('*:*') || permissions.includes(requiredPermission);
exports.shouldRenderPermissionGatedContent = shouldRenderPermissionGatedContent;
const shouldRenderAnyPermissionGatedContent = (permissions, requiredPermissions) => requiredPermissions.some((requiredPermission) => (0, exports.shouldRenderPermissionGatedContent)(permissions, requiredPermission));
exports.shouldRenderAnyPermissionGatedContent = shouldRenderAnyPermissionGatedContent;
