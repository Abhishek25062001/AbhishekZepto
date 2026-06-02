import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { CanAccessAny } from '../../components/auth/CanAccessAny';
import { Button, ErrorView, Loader } from '../../components/common';
import { VendorSummary } from '../../modules/vendor-stores/components/VendorSummary';
import { VendorStatusControl } from '../../modules/vendor-stores/components/VendorStatusControl';
import { useAdminVendorDetail } from '../../modules/vendor-stores/hooks/useAdminVendorDetail';
import { getApiErrorMessage } from '../../utils/error-message.util';

const VENDOR_STATUS_PERMISSIONS = ['stores:update', 'settings:manage'] as const;

export function VendorDetailPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [statusOpen, setStatusOpen] = useState(false);

  if (!vendorId) {
    return <Navigate replace to="/vendors" />;
  }

  const detailQuery = useAdminVendorDetail(vendorId);

  if (detailQuery.isLoading) {
    return <Loader label="Loading vendor..." mode="page" />;
  }

  if (detailQuery.error) {
    return (
      <ErrorView
        message={getApiErrorMessage(detailQuery.error, 'Unable to load vendor.')}
        onRetry={() => void detailQuery.refetch()}
        title="Unable to load vendor"
      />
    );
  }

  if (!detailQuery.data) {
    return <Navigate replace to="/vendors" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/vendors">Back to vendors</Link>
          <h1 style={{ marginBottom: 0 }}>Vendor Detail</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <CanAccessAny permissions={VENDOR_STATUS_PERMISSIONS}>
            <Button onClick={() => setStatusOpen(true)} type="button" variant="danger">
              Change Status
            </Button>
          </CanAccessAny>
          <Button onClick={() => void detailQuery.refetch()} type="button" variant="outline">
            Refresh
          </Button>
        </div>
      </header>

      <VendorSummary vendor={detailQuery.data} />

      <VendorStatusControl
        onClose={() => setStatusOpen(false)}
        open={statusOpen}
        vendor={detailQuery.data}
      />
    </div>
  );
}
