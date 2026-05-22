"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildVendorIncomingOrdersQuery = void 0;
exports.useVendorIncomingOrders = useVendorIncomingOrders;
const react_query_1 = require("@tanstack/react-query");
const react_router_dom_1 = require("react-router-dom");
const vendor_orders_api_1 = require("../api/vendor-orders.api");
const vendor_orders_query_util_1 = require("../utils/vendor-orders-query.util");
const parseNumberParam = (value, fallback) => {
    if (!value) {
        return fallback;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
const buildVendorIncomingOrdersQuery = (searchParams) => ({
    page: parseNumberParam(searchParams.get('page'), 1),
    limit: parseNumberParam(searchParams.get('limit'), 20),
});
exports.buildVendorIncomingOrdersQuery = buildVendorIncomingOrdersQuery;
function useVendorIncomingOrders() {
    const [searchParams] = (0, react_router_dom_1.useSearchParams)();
    const query = (0, vendor_orders_query_util_1.buildIncomingOrdersQuery)((0, exports.buildVendorIncomingOrdersQuery)(searchParams));
    return (0, react_query_1.useQuery)({
        queryKey: ['vendor-incoming-orders', query],
        queryFn: () => (0, vendor_orders_api_1.getVendorOrders)(query),
    });
}
