import React from 'react';

import { ErrorBoundary } from './src/components/common';
import { AppNavigator } from './src/app/AppNavigator';
import { QueryProvider } from './src/services/query/QueryProvider';

export default function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AppNavigator />
      </QueryProvider>
    </ErrorBoundary>
  );
}
