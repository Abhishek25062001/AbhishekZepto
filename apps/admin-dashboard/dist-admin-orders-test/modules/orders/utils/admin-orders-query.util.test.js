"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const admin_orders_query_util_1 = require("./admin-orders-query.util");
(0, node_test_1.test)('buildAdminOrderListQuery maps documented admin filters', () => {
    const query = (0, admin_orders_query_util_1.buildAdminOrderListQuery)(new URLSearchParams('status=accepted&storeStatus=accepted&storeId=store-1&cityId=city-1&paymentStatus=paid&customerId=customer-1&slaStatus=on_track&slaBreachedStage=acceptance&fromDate=2026-05-01&toDate=2026-05-21&page=2&limit=25&sort=createdAt_asc'));
    strict_1.default.equal(query.status, 'accepted');
    strict_1.default.equal(query.storeId, 'store-1');
    strict_1.default.equal(query.cityId, 'city-1');
    strict_1.default.equal(query.page, 2);
    strict_1.default.equal(query.limit, 25);
    strict_1.default.equal(query.sort, 'createdAt_asc');
});
(0, node_test_1.test)('parseAdminOrderNumberParam falls back for invalid values', () => {
    strict_1.default.equal((0, admin_orders_query_util_1.parseAdminOrderNumberParam)(null, 20), 20);
    strict_1.default.equal((0, admin_orders_query_util_1.parseAdminOrderNumberParam)('0', 20), 20);
    strict_1.default.equal((0, admin_orders_query_util_1.parseAdminOrderNumberParam)('10', 20), 10);
});
(0, node_test_1.test)('setAdminOrderSearchParams clears empty filters', () => {
    const params = new URLSearchParams('status=placed&page=2');
    (0, admin_orders_query_util_1.setAdminOrderSearchParams)(params, { status: undefined, page: 1 });
    strict_1.default.equal(params.toString(), 'page=1');
});
