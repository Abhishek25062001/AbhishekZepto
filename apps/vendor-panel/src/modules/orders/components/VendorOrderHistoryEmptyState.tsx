import { EmptyState } from '../../../components/common';

export function VendorOrderHistoryEmptyState() {
  return (
    <EmptyState
      description="Completed, cancelled, rejected, and past operational orders will appear here."
      title="No order history"
    />
  );
}
