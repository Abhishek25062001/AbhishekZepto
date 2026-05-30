"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const mobile_error_logger_1 = require("../../utils/mobile-error-logger");
const error_message_util_1 = require("../../utils/error-message.util");
const ErrorView_1 = require("./ErrorView");
class ErrorBoundary extends react_1.default.Component {
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
        (0, mobile_error_logger_1.logMobileError)(error, errorInfo.componentStack ?? undefined);
    }
    reset = () => {
        this.setState({
            hasError: false,
            message: '',
        });
    };
    render() {
        if (this.state.hasError) {
            return ((0, jsx_runtime_1.jsx)(ErrorView_1.ErrorView, { message: this.state.message, onRetry: this.reset, retryLabel: "Retry", title: "Something went wrong" }));
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
