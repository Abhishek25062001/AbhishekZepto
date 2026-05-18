import { Link, useParams } from 'react-router-dom';

import { CanAccess } from '../../../components/auth/CanAccess';
import { Card, Table, type TableColumn } from '../../../components/common';
import { VendorLowStockAlert } from '../components/VendorLowStockAlert';
import { VendorInventoryMovementBadge } from '../components/VendorInventoryMovementBadge';
import { VendorInventoryErrorState } from '../components/VendorInventoryErrorState';
import { VendorInventoryTableSkeleton } from '../components/VendorInventoryTableSkeleton';
import { VendorStockSummaryCards } from '../components/VendorStockSummaryCards';
import { useQuery } from '@tanstack/react-query';

import { getVendorInventoryMovements } from '../api/vendor-inventory.api';
import { useVendorInventoryStockDetail } from '../hooks/useVendorInventoryStockDetail';
import type { VendorInventoryMovement } from '../types/vendor-inventory.types';
import {
  extractApiErrorCode,
  mapInventoryErrorCodeToMessage,
} from '../utils/vendor-inventory-error-message.util';

type MovementRow = VendorInventoryMovement & Record<string, unknown>;

export function VendorInventoryStockDetailPage() {
  const { inventoryStockId } = useParams<{ inventoryStockId: string }>();
  const { data: stock, error, isLoading, refetch } = useVendorInventoryStockDetail(inventoryStockId);
  const movementsQuery = useQuery({
    queryKey: ['vendor-inventory-movements', inventoryStockId, 'recent'],
    queryFn: () =>
      getVendorInventoryMovements({
        inventoryStockId,
        limit: 10,
        page: 1,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    enabled: Boolean(inventoryStockId),
  });

  const recentMovements = (movementsQuery.data?.items ?? []).map(
    (movement) => ({ ...movement } as MovementRow),
  );

  if (error) {
    return (
      <VendorInventoryErrorState
        message={mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load stock.')}
        onRetry={() => void refetch()}
      />
    );
  }

  if (isLoading || !stock) {
    return <VendorInventoryTableSkeleton />;
  }

  const movementColumns: TableColumn<MovementRow>[] = [
    {
      header: 'Type',
      key: 'movementType',
      render: (row) => <VendorInventoryMovementBadge movementType={row.movementType} />,
    },
    { header: 'Qty', key: 'quantity' },
    { header: 'Reference', key: 'referenceType' },
    { header: 'When', key: 'createdAt' },
  ];

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <Link to="/inventory/stocks">← Stock list</Link>
        <h1>{stock.sku}</h1>
      </header>
      <VendorLowStockAlert stock={stock} />
      <VendorStockSummaryCards stock={stock} />
      <Card title="Thresholds">
        <p>Low stock threshold: {stock.lowStockThreshold}</p>
      </Card>
      <Card title="Product mapping">
        <p>Store product: {stock.storeProductId}</p>
        <p>Product: {stock.productId}</p>
        <p>Variant: {stock.variantId}</p>
      </Card>
      <Card title="Recent movements">
        <Table columns={movementColumns} data={recentMovements} rowKey="id" />
        <Link to={`/inventory/movements?inventoryStockId=${stock.id}`}>View all movements</Link>
      </Card>
      <Card title="System information">
        <p>Created: {stock.createdAt}</p>
        <p>Updated: {stock.updatedAt}</p>
      </Card>
      <CanAccess permission="inventory:update">
        <Link to={`/inventory/stocks/${stock.id}/adjust`}>Adjust stock</Link>
      </CanAccess>
    </section>
  );
}
