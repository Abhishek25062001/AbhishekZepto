import { useState } from 'react';

import { CanAccess } from '../../../components/auth/CanAccess';
import { Button } from '../../../components/common';
import { VendorRejectOrderForm } from '../forms/VendorRejectOrderForm';
import { useVendorOrderMutations } from '../hooks/useVendorOrderMutations';
import type { VendorOrderDetail } from '../types/vendor-orders.types';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';

export function VendorIncomingOrderActions({ order }: { order: VendorOrderDetail }) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const { acceptOrder, rejectOrder } = useVendorOrderMutations();
  const isActionable = order.orderStatus === 'placed' && order.storeStatus === 'pending_acceptance';
  const error = acceptOrder.error ?? rejectOrder.error;

  if (!isActionable) {
    return null;
  }

  return (
    <CanAccess permission="orders:update">
      <section style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <h2>Actions</h2>
        {error ? (
          <p role="alert">
            {mapVendorOrderErrorCodeToMessage(
              extractApiErrorCode(error),
              'Unable to update this order.',
            )}
          </p>
        ) : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Button
            loading={acceptOrder.isPending}
            onClick={() => acceptOrder.mutate({ orderId: order.orderId })}
            type="button"
          >
            Accept order
          </Button>
          <Button
            onClick={() => setShowRejectForm((current) => !current)}
            type="button"
            variant="outline"
          >
            Reject
          </Button>
        </div>
        {showRejectForm ? (
          <VendorRejectOrderForm
            loading={rejectOrder.isPending}
            onSubmit={async (values) => {
              await rejectOrder.mutateAsync({
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
