import React, { useEffect } from 'react';

import { ErrorBoundary } from './src/components/common';
import { AppNavigator } from './src/app/AppNavigator';
import { registerDeliveryBackgroundPushHandler } from './src/modules/push-notifications/services/delivery-background-push.service';
import { QueryProvider } from './src/services/query/QueryProvider';

export default function App() {
  useEffect(() => {
    registerDeliveryBackgroundPushHandler();
  }, []);

  return (
    <ErrorBoundary>
      <QueryProvider>
        <AppNavigator />
      </QueryProvider>
    </ErrorBoundary>
  );
}
