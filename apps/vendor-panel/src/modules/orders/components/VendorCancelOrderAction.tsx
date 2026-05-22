import { useState } from 'react';

import { CanAccess } from '../../../components/auth/CanAccess';
import { Button } from '../../../components/common';
import { VendorCancelOrderForm } from '../forms/VendorCancelOrderForm';
import { useVendorOrderMutations } from '../hooks/useVendorOrderMutations';
import type { VendorOrderDetail } from '../types/vendor-orders.types';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';
import { canCancelVendorStoreOrder } from '../utils/vendor-orders-workflow.util';

export function VendorCancelOrderAction({ order }: { order: VendorOrderDetail }) {
  const [showForm, setShowForm] = useState(false);
  const { cancelOrder } = useVendorOrderMutations();

  if (!canCancelVendorStoreOrder(order)) {
    return null;
  }

  return (
    <CanAccess permission="orders:update">
      <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <h2>Cancel order</h2>
        {cancelOrder.error ? (
          <p role="alert">
            {mapVendorOrderErrorCodeToMessage(
              extractApiErrorCode(cancelOrder.error),
              'Unable to cancel this order.',
            )}
          </p>
        ) : null}
        <Button
          onClick={() => setShowForm((current) => !current)}
          type="button"
          variant="danger"
        >
          Cancel order
        </Button>
        {showForm ? (
          <VendorCancelOrderForm
            loading={cancelOrder.isPending}
            onSubmit={async (values) => {
              await cancelOrder.mutateAsync({
                orderId: order.orderId,
                payload: values,
              });
            }}
          />
        ) : null}
      </section>
    </CanAccess>
  );
}
