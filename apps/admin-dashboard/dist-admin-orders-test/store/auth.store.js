"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = exports.isAdminAuthRole = void 0;
const zustand_1 = require("zustand");
const adminAuthRoles = ['support_admin', 'operations_admin', 'super_admin'];
const isAdminAuthRole = (role) => {
    return role !== null && adminAuthRoles.includes(role);
};
exports.isAdminAuthRole = isAdminAuthRole;
exports.useAuthStore = (0, zustand_1.create)((set) => ({
    accessToken: null,
    refreshToken: null,
    adminId: null,
    role: null,
    permissions: [],
    isAuthenticated: false,
    setAuthSession: (session) => set({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        adminId: session.adminId,
        role: session.role ?? null,
        permissions: session.permissions ?? [],
        isAuthenticated: true,
    }),
    clearAuthSession: () => set({
        accessToken: null,
        refreshToken: null,
        adminId: null,
        role: null,
        permissions: [],
        isAuthenticated: false,
    }),
}));
