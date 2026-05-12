import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary, Loader } from '../components/common';
import { useRestoreVendorSession } from '../hooks/useRestoreVendorSession';
import { QueryProvider } from '../services/query/QueryProvider';
import { router } from './router';

function VendorPanelRouter() {
  const { isRestoringSession } = useRestoreVendorSession();

  if (isRestoringSession) {
    return <Loader label="Restoring vendor session..." />;
  }

  return <RouterProvider router={router} />;
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <VendorPanelRouter />
      </QueryProvider>
    </ErrorBoundary>
  );
}
