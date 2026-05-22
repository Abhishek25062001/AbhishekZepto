"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = Loader;
const jsx_runtime_1 = require("react/jsx-runtime");
function Loader({ label = 'Loading...', mode = 'inline' }) {
    return ((0, jsx_runtime_1.jsx)("p", { style: {
            alignItems: 'center',
            display: 'flex',
            justifyContent: mode === 'page' ? 'center' : 'flex-start',
            minHeight: mode === 'page' ? '240px' : undefined,
        }, children: label }));
}
