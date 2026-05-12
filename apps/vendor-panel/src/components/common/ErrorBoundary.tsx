import { Component, type ErrorInfo, type PropsWithChildren } from 'react';

import { getApiErrorMessage } from '../../utils/error-message.util';
import { logClientError } from '../../utils/client-error-logger';
import { ErrorView } from './ErrorView';

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  override state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: getApiErrorMessage(error),
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logClientError(error, errorInfo.componentStack ?? undefined);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <ErrorView
          message={this.state.message}
          onRetry={() => window.location.reload()}
          retryLabel="Reload"
          title="Something went wrong"
        />
      );
    }

    return this.props.children;
  }
}
