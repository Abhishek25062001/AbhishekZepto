import { CanAccess } from '../../../components/auth/CanAccess';
import { AdminCancelOrderForm } from '../forms/AdminCancelOrderForm';
import { useAdminOrderMutations } from '../hooks/useAdminOrderMutations';
import type { AdminOrderDetail } from '../types/admin-orders.types';
import { canShowAdminCancellationAction } from '../utils/admin-orders-workflow.util';

type AdminOrderCancelActionProps = {
  order: AdminOrderDetail;
};

export function AdminOrderCancelAction({ order }: AdminOrderCancelActionProps) {
  const { cancelOrderMutation } = useAdminOrderMutations(order.orderId);

  if (!canShowAdminCancellationAction(order)) {
    return null;
  }

  return (
    <CanAccess permission="orders:cancel">
      <section>
        <h2>Cancel order</h2>
        <AdminCancelOrderForm
          loading={cancelOrderMutation.isPending}
          onSubmit={(values) => cancelOrderMutation.mutate(values)}
        />
      </section>
    </CanAccess>
  );
}
