import { EmptyState } from '../../../components/common';

export function VendorIncomingOrdersEmptyState() {
  return (
    <EmptyState
      description="Incoming orders waiting for store review will appear here."
      title="No incoming orders"
    />
  );
}
