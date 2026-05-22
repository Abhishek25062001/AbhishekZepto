import { CanAccess } from '../../../components/auth/CanAccess';
import { Button } from '../../../components/common';
import { useVendorOrderMutations } from '../hooks/useVendorOrderMutations';
import type { VendorOrderDetail } from '../types/vendor-orders.types';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';
import { canStartVendorOrderPicking } from '../utils/vendor-orders-workflow.util';

export function VendorStartPickingAction({ order }: { order: VendorOrderDetail }) {
  const { startPicking } = useVendorOrderMutations();

  if (!canStartVendorOrderPicking(order)) {
    return null;
  }

  return (
    <CanAccess permission="orders:update">
      <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <h2>Picking</h2>
        {startPicking.error ? (
          <p role="alert">
            {mapVendorOrderErrorCodeToMessage(
              extractApiErrorCode(startPicking.error),
              'Unable to start picking for this order.',
            )}
          </p>
        ) : null}
        <Button
          loading={startPicking.isPending}
          onClick={() => startPicking.mutate({ orderId: order.orderId })}
          type="button"
        >
          Start picking
        </Button>
      </section>
    </CanAccess>
  );
}
