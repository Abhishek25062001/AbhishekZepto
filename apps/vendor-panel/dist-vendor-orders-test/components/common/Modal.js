"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = Modal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function Modal({ children, footer, onClose, open, title }) {
    (0, react_1.useEffect)(() => {
        if (!open) {
            return;
        }
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, open]);
    if (!open) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("div", { role: "presentation", style: {
            alignItems: 'center',
            background: 'rgba(17, 24, 39, 0.45)',
            display: 'flex',
            inset: 0,
            justifyContent: 'center',
            position: 'fixed',
        }, children: (0, jsx_runtime_1.jsxs)("section", { "aria-modal": "true", role: "dialog", style: {
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                maxWidth: '520px',
                padding: 'var(--spacing-xl)',
                width: '100%',
            }, children: [title ? (0, jsx_runtime_1.jsx)("h2", { children: title }) : null, children, footer ? (0, jsx_runtime_1.jsx)("footer", { style: { marginTop: 'var(--spacing-lg)' }, children: footer }) : null, (0, jsx_runtime_1.jsx)("button", { onClick: onClose, type: "button", children: "Close" })] }) }));
}
