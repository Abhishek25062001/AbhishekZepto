"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const catalog_permissions_util_1 = require("./catalog-permissions.util");
(0, node_test_1.test)('catalog permission helpers honor exact grants', () => {
    strict_1.default.equal((0, catalog_permissions_util_1.canReadCatalog)(['catalog:read']), true);
    strict_1.default.equal((0, catalog_permissions_util_1.canReadCatalog)(['users:read']), false);
    strict_1.default.equal((0, catalog_permissions_util_1.canCreateCatalog)(['catalog:create']), true);
    strict_1.default.equal((0, catalog_permissions_util_1.canUpdateCatalog)(['catalog:update']), true);
    strict_1.default.equal((0, catalog_permissions_util_1.canDeleteCatalog)(['catalog:delete']), true);
    strict_1.default.equal((0, catalog_permissions_util_1.canApproveCatalog)(['catalog:approve']), true);
    strict_1.default.equal((0, catalog_permissions_util_1.canUploadMedia)(['media:upload']), true);
});
(0, node_test_1.test)('catalog permission helpers allow super admin wildcard', () => {
    strict_1.default.equal((0, catalog_permissions_util_1.canReadCatalog)(['*:*']), true);
    strict_1.default.equal((0, catalog_permissions_util_1.canUploadMedia)(['*:*']), true);
});
