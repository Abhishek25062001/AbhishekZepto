import { Link, useNavigate, useParams } from 'react-router-dom';

import { VendorInventoryAdjustmentForm } from '../forms/VendorInventoryAdjustmentForm';
import { VendorInventoryErrorState } from '../components/VendorInventoryErrorState';
import { VendorInventoryTableSkeleton } from '../components/VendorInventoryTableSkeleton';
import { useVendorInventoryMutations } from '../hooks/useVendorInventoryMutations';
import { useVendorInventoryStockDetail } from '../hooks/useVendorInventoryStockDetail';
import {
  extractApiErrorCode,
  mapInventoryErrorCodeToMessage,
} from '../utils/vendor-inventory-error-message.util';

export function VendorInventoryAdjustmentPage() {
  const navigate = useNavigate();
  const { inventoryStockId } = useParams<{ inventoryStockId: string }>();
  const { data, error, isLoading, refetch } = useVendorInventoryStockDetail(inventoryStockId);
  const { adjustStock } = useVendorInventoryMutations();

  if (error) {
    return (
      <VendorInventoryErrorState
        message={mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load stock.')}
        onRetry={() => void refetch()}
      />
    );
  }

  if (isLoading || !data) {
    return <VendorInventoryTableSkeleton />;
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <Link to={`/inventory/stocks/${data.id}`}>← Stock detail</Link>
        <h1>Adjust stock — {data.sku}</h1>
      </header>
      <VendorInventoryAdjustmentForm
        availableQuantity={data.availableQuantity}
        loading={adjustStock.isPending}
        onSubmit={async (values) => {
          await adjustStock.mutateAsync({ inventoryStockId: data.id, payload: values });
          navigate(`/inventory/stocks/${data.id}`);
        }}
      />
    </section>
  );
}
