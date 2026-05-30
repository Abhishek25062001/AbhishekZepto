"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = exports.isCustomerAuthRole = void 0;
const zustand_1 = require("zustand");
const isCustomerAuthRole = (role) => role === 'customer';
exports.isCustomerAuthRole = isCustomerAuthRole;
exports.useAuthStore = (0, zustand_1.create)((set) => ({
    accessToken: null,
    refreshToken: null,
    customerId: null,
    cityId: null,
    role: null,
    permissions: [],
    isAuthenticated: false,
    setAuthSession: (session) => set({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        customerId: session.customerId,
        cityId: session.cityId ?? null,
        role: session.role ?? null,
        permissions: session.permissions ?? [],
        isAuthenticated: true,
    }),
    clearAuthSession: () => set({
        accessToken: null,
        refreshToken: null,
        customerId: null,
        cityId: null,
        role: null,
        permissions: [],
        isAuthenticated: false,
    }),
}));
