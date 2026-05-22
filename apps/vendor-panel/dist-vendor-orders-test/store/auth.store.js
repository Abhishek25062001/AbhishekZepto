"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = exports.isVendorAuthRole = void 0;
const zustand_1 = require("zustand");
const vendorAuthRoles = ['vendor_owner', 'store_manager', 'store_staff'];
const isVendorAuthRole = (role) => {
    return role !== null && vendorAuthRoles.includes(role);
};
exports.isVendorAuthRole = isVendorAuthRole;
exports.useAuthStore = (0, zustand_1.create)((set) => ({
    accessToken: null,
    refreshToken: null,
    vendorUserId: null,
    vendorId: null,
    storeId: null,
    cityId: null,
    role: null,
    permissions: [],
    isAuthenticated: false,
    setAuthSession: (session) => set({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        vendorUserId: session.vendorUserId,
        vendorId: session.vendorId,
        storeId: session.storeId,
        cityId: session.cityId ?? null,
        role: session.role ?? null,
        permissions: session.permissions ?? [],
        isAuthenticated: true,
    }),
    clearAuthSession: () => set({
        accessToken: null,
        refreshToken: null,
        vendorUserId: null,
        vendorId: null,
        storeId: null,
        cityId: null,
        role: null,
        permissions: [],
        isAuthenticated: false,
    }),
}));
