"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_EXPORT_STATUSES = exports.DATA_EXPORT_FORMATS = exports.DATA_EXPORT_TYPES = void 0;
exports.DATA_EXPORT_TYPES = [
    'admin_users',
    'customers',
    'delivery_agents',
    'vendors',
    'stores',
    'support_tickets',
    'audit_logs',
    'operational_analytics',
    'platform_settings',
];
exports.DATA_EXPORT_FORMATS = ['csv', 'json'];
exports.DATA_EXPORT_STATUSES = ['queued', 'completed', 'failed'];
