import React, { type ErrorInfo, type PropsWithChildren } from 'react';

import { logMobileError } from '../../utils/mobile-error-logger';
import { getApiErrorMessage } from '../../utils/error-message.util';
import { ErrorView } from './ErrorView';

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends React.Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
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
    logMobileError(error, errorInfo.componentStack ?? undefined);
  }

  private reset = () => {
    this.setState({
      hasError: false,
      message: '',
    });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <ErrorView
          message={this.state.message}
          onRetry={this.reset}
          retryLabel="Retry"
          title="Something went wrong"
        />
      );
    }

    return this.props.children;
  }
}
