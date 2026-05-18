import { Badge, Card, ErrorView, Loader } from '../../components/common';
import { isDevelopment } from '../../config/env';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export function DashboardPage() {
  const { error, healthData, isLoading } = useBackendHealth();
  const errorMessage = error instanceof Error ? error.message : 'Unable to load backend health.';
  const adminId = useAuthStore((state) => state.adminId);

  return (
    <>
      <h1>Admin Dashboard</h1>
      <Card description="Shared UI foundation placeholder for admin operations." title="Dashboard summary">
        <p>Administrative summaries will be added in the owning admin modules.</p>
      </Card>
      {isDevelopment ? (
        <Card title="Backend health">
          {isLoading ? <Loader label="Checking backend health..." /> : null}
          {error ? <ErrorView message={errorMessage} title="Backend health unavailable" /> : null}
          {healthData ? (
            <p>
              {healthData.service}: <Badge variant="success">{healthData.status}</Badge> / database{' '}
              <Badge variant={healthData.database.status === 'connected' ? 'success' : 'warning'}>
                {healthData.database.status}
              </Badge>
            </p>
          ) : null}
          <div style={{ display: 'grid', gap: '4px', marginTop: 'var(--spacing-md)' }}>
            <p style={{ margin: 0 }}>
              Admin summary: {adminId ?? 'n/a'}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/debug">Debug</Link>
              <Link to="/debug/auth-smoke">Auth smoke</Link>
            </div>
          </div>
        </Card>
      ) : null}
    </>
  );
}
