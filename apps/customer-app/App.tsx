import React, { useEffect } from 'react';

import { ErrorBoundary } from './src/components/common';
import { AppNavigator } from './src/app/AppNavigator';
import { registerCustomerBackgroundPushHandler } from './src/modules/push-notifications/services/customer-background-push.service';
import { QueryProvider } from './src/services/query/QueryProvider';

export default function App() {
  useEffect(() => {
    registerCustomerBackgroundPushHandler();
  }, []);

  return (
    <ErrorBoundary>
      <QueryProvider>
        <AppNavigator />
      </QueryProvider>
    </ErrorBoundary>
  );
}
