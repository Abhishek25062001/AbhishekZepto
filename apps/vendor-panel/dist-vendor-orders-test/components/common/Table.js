"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = Table;
const jsx_runtime_1 = require("react/jsx-runtime");
function Table({ columns, data, emptyMessage = 'No records found.', loading = false, rowKey, }) {
    return ((0, jsx_runtime_1.jsxs)("table", { style: { borderCollapse: 'collapse', width: '100%' }, children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsx)("tr", { children: columns.map((column) => ((0, jsx_runtime_1.jsx)("th", { style: {
                            borderBottom: '1px solid var(--color-border)',
                            color: 'var(--color-text-secondary)',
                            padding: 'var(--spacing-sm) 0',
                            textAlign: 'left',
                        }, children: column.header }, column.key))) }) }), (0, jsx_runtime_1.jsxs)("tbody", { children: [loading ? ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: columns.length, style: { padding: 'var(--spacing-md) 0' }, children: "Loading..." }) })) : null, !loading && data.length === 0 ? ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: columns.length, style: { padding: 'var(--spacing-md) 0' }, children: emptyMessage }) })) : null, !loading
                        ? data.map((row, rowIndex) => ((0, jsx_runtime_1.jsx)("tr", { children: columns.map((column) => ((0, jsx_runtime_1.jsx)("td", { style: { borderBottom: '1px solid var(--color-border)', padding: 'var(--spacing-sm) 0' }, children: column.render ? column.render(row) : String(row[column.key] ?? '') }, column.key))) }, getRowKey(row, rowIndex, rowKey))))
                        : null] })] }));
}
function getRowKey(row, index, rowKey) {
    if (typeof rowKey === 'function') {
        return rowKey(row, index);
    }
    if (rowKey) {
        return String(row[rowKey]);
    }
    return String(index);
}
