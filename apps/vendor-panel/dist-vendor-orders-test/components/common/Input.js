"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = Input;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function Input({ disabled = false, error, id, label, onChange, type = 'text', ...props }) {
    const generatedId = (0, react_1.useId)();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    return ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: '6px' }, children: [label ? (0, jsx_runtime_1.jsx)("label", { htmlFor: inputId, children: label }) : null, (0, jsx_runtime_1.jsx)("input", { ...props, "aria-describedby": errorId, "aria-invalid": error ? true : undefined, disabled: disabled, id: inputId, onChange: onChange, style: {
                    background: disabled ? 'var(--color-background)' : 'var(--color-surface)',
                    border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    color: disabled ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
                    padding: 'var(--spacing-md)',
                }, type: type }), error ? ((0, jsx_runtime_1.jsx)("span", { id: errorId, style: { color: 'var(--color-error)' }, children: error })) : null] }));
}
