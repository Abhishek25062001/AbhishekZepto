"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = exports.isDeliveryAuthRole = void 0;
const zustand_1 = require("zustand");
const isDeliveryAuthRole = (role) => role === 'delivery_agent';
exports.isDeliveryAuthRole = isDeliveryAuthRole;
exports.useAuthStore = (0, zustand_1.create)((set) => ({
    accessToken: null,
    refreshToken: null,
    deliveryAgentId: null,
    cityId: null,
    role: null,
    permissions: [],
    isAuthenticated: false,
    setAuthSession: (session) => set({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        deliveryAgentId: session.deliveryAgentId,
        cityId: session.cityId ?? null,
        role: session.role ?? null,
        permissions: session.permissions ?? [],
        isAuthenticated: true,
    }),
    clearAuthSession: () => set({
        accessToken: null,
        refreshToken: null,
        deliveryAgentId: null,
        cityId: null,
        role: null,
        permissions: [],
        isAuthenticated: false,
    }),
}));
