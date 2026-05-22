import { EmptyState } from '../../../components/common';

export function VendorActiveOrdersEmptyState() {
  return (
    <EmptyState
      description="Accepted, picking, packing, and ready-for-pickup orders will appear here."
      title="No active orders"
    />
  );
}
