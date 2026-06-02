"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSearchParams = exports.parseOptionalBoolean = exports.parseOptionalString = exports.parseNumberParam = void 0;
const parseNumberParam = (value, fallback) => {
    if (!value) {
        return fallback;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
exports.parseNumberParam = parseNumberParam;
const parseOptionalString = (value) => value && value.trim() ? value.trim() : undefined;
exports.parseOptionalString = parseOptionalString;
const parseOptionalBoolean = (value) => {
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    return undefined;
};
exports.parseOptionalBoolean = parseOptionalBoolean;
const setSearchParams = (params, updates) => {
    Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            params.delete(key);
            return;
        }
        params.set(key, String(value));
    });
};
exports.setSearchParams = setSearchParams;
