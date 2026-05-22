"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const error_message_util_1 = require("../../utils/error-message.util");
const client_error_logger_1 = require("../../utils/client-error-logger");
const ErrorView_1 = require("./ErrorView");
class ErrorBoundary extends react_1.Component {
    state = {
        hasError: false,
        message: '',
    };
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            message: (0, error_message_util_1.getApiErrorMessage)(error),
        };
    }
    componentDidCatch(error, errorInfo) {
        (0, client_error_logger_1.logClientError)(error, errorInfo.componentStack ?? undefined);
    }
    render() {
        if (this.state.hasError) {
            return ((0, jsx_runtime_1.jsx)(ErrorView_1.ErrorView, { message: this.state.message, onRetry: () => window.location.reload(), retryLabel: "Reload", title: "Something went wrong" }));
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
