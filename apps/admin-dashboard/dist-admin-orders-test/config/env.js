"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopment = exports.API_BASE_URL = exports.APP_ENV = void 0;
const runtimeEnv = import.meta.env ?? {};
exports.APP_ENV = runtimeEnv.VITE_APP_ENV ?? 'development';
exports.API_BASE_URL = runtimeEnv.VITE_API_BASE_URL ?? 'http://localhost:5000';
exports.isDevelopment = exports.APP_ENV === 'development';
