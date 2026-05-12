import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary, Loader } from '../components/common';
import { useRestoreAdminSession } from '../hooks/useRestoreAdminSession';
import { QueryProvider } from '../services/query/QueryProvider';
import { router } from './router';

function AdminDashboardRouter() {
  const { isRestoringSession } = useRestoreAdminSession();

  if (isRestoringSession) {
    return <Loader label="Restoring admin session..." />;
  }

  return <RouterProvider router={router} />;
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AdminDashboardRouter />
      </QueryProvider>
    </ErrorBoundary>
  );
}
