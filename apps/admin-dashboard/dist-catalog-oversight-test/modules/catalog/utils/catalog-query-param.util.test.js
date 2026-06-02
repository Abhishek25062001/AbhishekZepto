"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const catalog_query_param_util_1 = require("./catalog-query-param.util");
(0, node_test_1.test)('parseNumberParam falls back when input is missing or invalid', () => {
    strict_1.default.equal((0, catalog_query_param_util_1.parseNumberParam)(null, 5), 5);
    strict_1.default.equal((0, catalog_query_param_util_1.parseNumberParam)('0', 3), 3);
    strict_1.default.equal((0, catalog_query_param_util_1.parseNumberParam)('abc', 2), 2);
    strict_1.default.equal((0, catalog_query_param_util_1.parseNumberParam)('4', 1), 4);
});
(0, node_test_1.test)('parseOptionalString trims meaningful values', () => {
    strict_1.default.equal((0, catalog_query_param_util_1.parseOptionalString)(null), undefined);
    strict_1.default.equal((0, catalog_query_param_util_1.parseOptionalString)('   '), undefined);
    strict_1.default.equal((0, catalog_query_param_util_1.parseOptionalString)(' hello '), 'hello');
});
(0, node_test_1.test)('parseOptionalBoolean handles explicit tokens only', () => {
    strict_1.default.equal((0, catalog_query_param_util_1.parseOptionalBoolean)(null), undefined);
    strict_1.default.equal((0, catalog_query_param_util_1.parseOptionalBoolean)('true'), true);
    strict_1.default.equal((0, catalog_query_param_util_1.parseOptionalBoolean)('false'), false);
    strict_1.default.equal((0, catalog_query_param_util_1.parseOptionalBoolean)('yes'), undefined);
});
(0, node_test_1.test)('setSearchParams clears keys when updated to empty values', () => {
    const params = new URLSearchParams('page=2&search=foo&featured=true');
    (0, catalog_query_param_util_1.setSearchParams)(params, {
        featured: undefined,
        page: '',
        search: null,
    });
    strict_1.default.equal(params.toString(), '');
});
