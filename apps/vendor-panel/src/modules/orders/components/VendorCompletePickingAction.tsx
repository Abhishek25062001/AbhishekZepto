import { CanAccess } from '../../../components/auth/CanAccess';
import { Button } from '../../../components/common';
import { useVendorOrderMutations } from '../hooks/useVendorOrderMutations';
import type { VendorOrderDetail } from '../types/vendor-orders.types';
import {
  extractApiErrorCode,
  mapVendorOrderErrorCodeToMessage,
} from '../utils/vendor-orders-error-message.util';
import { canCompleteVendorOrderPicking } from '../utils/vendor-orders-workflow.util';

export function VendorCompletePickingAction({ order }: { order: VendorOrderDetail }) {
  const { completePicking } = useVendorOrderMutations();

  if (!canCompleteVendorOrderPicking(order)) {
    return null;
  }

  return (
    <CanAccess permission="orders:update">
      <section style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <h2>Complete picking</h2>
        {completePicking.error ? (
          <p role="alert">
            {mapVendorOrderErrorCodeToMessage(
              extractApiErrorCode(completePicking.error),
              'Unable to complete picking for this order.',
            )}
          </p>
        ) : null}
        <Button
          loading={completePicking.isPending}
          onClick={() => completePicking.mutate({ orderId: order.orderId })}
          type="button"
        >
          Complete picking
        </Button>
      </section>
    </CanAccess>
  );
}
