import { Badge } from '../../../components/common';
import type { VendorOrderStatus, VendorOrderStoreStatus } from '../types/vendor-orders.types';

const ORDER_STATUS_LABELS: Record<VendorOrderStatus, string> = {
  accepted: 'Accepted',
  cancelled: 'Cancelled',
  packing: 'Packing',
  picking: 'Picking',
  placed: 'Placed',
  ready_for_pickup: 'Ready for pickup',
};

const STORE_STATUS_LABELS: Record<VendorOrderStoreStatus, string> = {
  accepted: 'Accepted',
  pending_acceptance: 'Pending',
  rejected: 'Rejected',
};

export function VendorOrderStatusBadge({ status }: { status: VendorOrderStatus }) {
  const variant = status === 'cancelled' ? 'error' : status === 'placed' ? 'warning' : 'success';
  return <Badge variant={variant}>{ORDER_STATUS_LABELS[status]}</Badge>;
}

export function VendorStoreStatusBadge({ status }: { status: VendorOrderStoreStatus }) {
  const variant = status === 'rejected' ? 'error' : status === 'pending_acceptance' ? 'warning' : 'success';
  return <Badge variant={variant}>{STORE_STATUS_LABELS[status]}</Badge>;
}
