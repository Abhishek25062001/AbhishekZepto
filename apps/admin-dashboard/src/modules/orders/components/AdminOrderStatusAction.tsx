import { CanAccess } from '../../../components/auth/CanAccess';
import { AdminOrderStatusUpdateForm } from '../forms/AdminOrderStatusUpdateForm';
import { useAdminOrderMutations } from '../hooks/useAdminOrderMutations';
import type { AdminOrderDetail } from '../types/admin-orders.types';
import {
  canShowAdminStatusUpdateAction,
  getNextAdminOrderStatuses,
} from '../utils/admin-orders-workflow.util';

type AdminOrderStatusActionProps = {
  order: AdminOrderDetail;
};

export function AdminOrderStatusAction({ order }: AdminOrderStatusActionProps) {
  const { updateStatusMutation } = useAdminOrderMutations(order.orderId);

  if (!canShowAdminStatusUpdateAction(order)) {
    return null;
  }

  return (
    <CanAccess permission="orders:update-status">
      <section>
        <h2>Update status</h2>
        <AdminOrderStatusUpdateForm
          availableStatuses={getNextAdminOrderStatuses(order.orderStatus)}
          loading={updateStatusMutation.isPending}
          onSubmit={(values) => updateStatusMutation.mutate(values)}
        />
      </section>
    </CanAccess>
  );
}
