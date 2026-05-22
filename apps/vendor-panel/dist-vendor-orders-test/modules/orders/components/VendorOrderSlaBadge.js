"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorOrderSlaBadge = VendorOrderSlaBadge;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_1 = require("../../../components/common");
function VendorOrderSlaBadge({ slaStatus }) {
    if (!slaStatus) {
        return (0, jsx_runtime_1.jsx)(common_1.Badge, { variant: "neutral", children: "Needs verification" });
    }
    const variant = slaStatus === 'breached' ? 'error' : slaStatus === 'at_risk' ? 'warning' : 'success';
    return (0, jsx_runtime_1.jsx)(common_1.Badge, { variant: variant, children: slaStatus.replaceAll('_', ' ') });
}
