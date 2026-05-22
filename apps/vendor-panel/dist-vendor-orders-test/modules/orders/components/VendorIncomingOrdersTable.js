"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INCOMING_ORDER_LIST_COLUMNS = void 0;
exports.VendorIncomingOrdersTable = VendorIncomingOrdersTable;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_1 = require("../../../components/common");
const VendorOrderSlaBadge_1 = require("./VendorOrderSlaBadge");
const VendorOrderStatusBadge_1 = require("./VendorOrderStatusBadge");
exports.INCOMING_ORDER_LIST_COLUMNS = [
    'Order',
    'Order status',
    'Store status',
    'Payment',
    'Total',
    'Placed',
    'SLA',
];
const formatDateTime = (value) => new Date(value).toLocaleString();
const columns = [
    { header: exports.INCOMING_ORDER_LIST_COLUMNS[0], key: 'orderNumber' },
    {
        header: exports.INCOMING_ORDER_LIST_COLUMNS[1],
        key: 'orderStatus',
        render: (row) => (0, jsx_runtime_1.jsx)(VendorOrderStatusBadge_1.VendorOrderStatusBadge, { status: row.orderStatus }),
    },
    {
        header: exports.INCOMING_ORDER_LIST_COLUMNS[2],
        key: 'storeStatus',
        render: (row) => (0, jsx_runtime_1.jsx)(VendorOrderStatusBadge_1.VendorStoreStatusBadge, { status: row.storeStatus }),
    },
    { header: exports.INCOMING_ORDER_LIST_COLUMNS[3], key: 'paymentStatus' },
    {
        header: exports.INCOMING_ORDER_LIST_COLUMNS[4],
        key: 'grandTotal',
        render: (row) => `${row.currency} ${row.grandTotal.toFixed(2)}`,
    },
    {
        header: exports.INCOMING_ORDER_LIST_COLUMNS[5],
        key: 'createdAt',
        render: (row) => formatDateTime(row.createdAt),
    },
    {
        header: exports.INCOMING_ORDER_LIST_COLUMNS[6],
        key: 'slaStatus',
        render: (row) => (0, jsx_runtime_1.jsx)(VendorOrderSlaBadge_1.VendorOrderSlaBadge, { slaStatus: row.slaStatus }),
    },
];
function VendorIncomingOrdersTable({ isFetching = false, orders, }) {
    const rows = orders.map((order) => ({ ...order }));
    return ((0, jsx_runtime_1.jsx)(common_1.Table, { columns: columns, data: rows, emptyMessage: "No incoming orders.", loading: isFetching, rowKey: "orderId" }));
}
