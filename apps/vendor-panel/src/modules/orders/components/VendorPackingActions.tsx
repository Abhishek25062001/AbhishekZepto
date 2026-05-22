import { CanAccess } from '../../../components/auth/CanAccess';
import { Button } from '../../../components/common';
import { useVendorOrderMutations } from '../hooks/useVendorOrderMutations';
import type { VendorOrderDetail } from '../types/vendor-orders.types';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';
import {
  canCompleteVendorOrderPacking,
  canMarkVendorOrderReadyForPickup,
  canStartVendorOrderPacking,
} from '../utils/vendor-orders-workflow.util';

export function VendorPackingActions({ order }: { order: VendorOrderDetail }) {
  const { completePacking, markReadyForPickup, startPacking } = useVendorOrderMutations();
  const canStart = canStartVendorOrderPacking(order);
  const canComplete = canCompleteVendorOrderPacking(order);
  const canReady = canMarkVendorOrderReadyForPickup(order);
  const error = startPacking.error ?? completePacking.error ?? markReadyForPickup.error;

  if (!canStart && !canComplete && !canReady) {
    return null;
  }

  return (
    <CanAccess permission="orders:update">
      <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <h2>Packing</h2>
        {error ? (
          <p role="alert">
            {mapVendorOrderErrorCodeToMessage(
              extractApiErrorCode(error),
              'Unable to update packing state for this order.',
            )}
          </p>
        ) : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          {canStart ? (
            <Button
              loading={startPacking.isPending}
              onClick={() => startPacking.mutate({ orderId: order.orderId })}
              type="button"
            >
              Start packing
            </Button>
          ) : null}
          {canComplete ? (
            <Button
              loading={completePacking.isPending}
              onClick={() => completePacking.mutate({ orderId: order.orderId })}
              type="button"
            >
              Complete packing
            </Button>
          ) : null}
          {canReady ? (
            <Button
              loading={markReadyForPickup.isPending}
              onClick={() => markReadyForPickup.mutate({ orderId: order.orderId })}
              type="button"
            >
              Ready for pickup
            </Button>
          ) : null}
        </div>
      </section>
    </CanAccess>
  );
}
