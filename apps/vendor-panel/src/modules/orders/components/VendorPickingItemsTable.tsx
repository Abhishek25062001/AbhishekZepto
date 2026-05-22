import { CanAccess } from '../../../components/auth/CanAccess';
import { Table, type TableColumn } from '../../../components/common';
import { VendorOrderItemQuantityForm } from '../forms/VendorOrderItemQuantityForm';
import { useVendorOrderMutations } from '../hooks/useVendorOrderMutations';
import type { VendorOrderDetail } from '../types/vendor-orders.types';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';
import { canUpdateVendorOrderItemPicking, getVendorOrderItemRemainingQuantity } from '../utils/vendor-orders-workflow.util';

type PickingItemRow = VendorOrderDetail['items'][number] & Record<string, unknown>;

const columns: TableColumn<PickingItemRow>[] = [
  { header: 'Product', key: 'productName', render: (row) => row.productName ?? row.productId },
  { header: 'Ordered', key: 'quantity' },
  { header: 'Picked', key: 'pickedQuantity' },
  { header: 'Missing', key: 'missingQuantity' },
  {
    header: 'Remaining',
    key: 'storeProductId',
    render: (row) => getVendorOrderItemRemainingQuantity(row),
  },
  { header: 'Status', key: 'pickingStatus' },
];

export function VendorPickingItemsTable({ order }: { order: VendorOrderDetail }) {
  const { markItemMissing, markItemPicked } = useVendorOrderMutations();
  const rows = order.items.map((item) => ({ ...item } as PickingItemRow));
  const isItemActionable = canUpdateVendorOrderItemPicking(order);
  const error = markItemPicked.error ?? markItemMissing.error;

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
      <h2>Picking items</h2>
      {error ? (
        <p role="alert">
          {mapVendorOrderErrorCodeToMessage(
            extractApiErrorCode(error),
            'Unable to update item picking quantity.',
          )}
        </p>
      ) : null}
      <Table columns={columns} data={rows} emptyMessage="No picking items." rowKey="storeProductId" />
      {isItemActionable ? (
        <CanAccess permission="orders:update">
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {order.items.map((item) => {
              const remainingForPicked = Math.max(item.quantity - item.missingQuantity, 1);
              const remainingForMissing = Math.max(item.quantity - item.pickedQuantity, 1);
              return (
                <section
                  key={item.storeProductId}
                  style={{
                    borderTop: '1px solid var(--color-border)',
                    display: 'grid',
                    gap: 'var(--spacing-sm)',
                    paddingTop: 'var(--spacing-md)',
                  }}
                >
                  <strong>{item.productName ?? item.productId}</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                    <VendorOrderItemQuantityForm
                      buttonLabel="Set picked"
                      inputId={`picked-${item.storeProductId}`}
                      label="Picked quantity"
                      loading={markItemPicked.isPending}
                      maxQuantity={remainingForPicked}
                      onSubmit={async (values) => {
                        await markItemPicked.mutateAsync({
                          itemId: item.storeProductId,
                          orderId: order.orderId,
                          payload: values,
                        });
                      }}
                    />
                    <VendorOrderItemQuantityForm
                      buttonLabel="Set missing"
                      inputId={`missing-${item.storeProductId}`}
                      label="Missing quantity"
                      loading={markItemMissing.isPending}
                      maxQuantity={remainingForMissing}
                      onSubmit={async (values) => {
                        await markItemMissing.mutateAsync({
                          itemId: item.storeProductId,
                          orderId: order.orderId,
                          payload: values,
                        });
                      }}
                    />
                  </div>
                </section>
              );
            })}
          </div>
        </CanAccess>
      ) : null}
    </section>
  );
}
