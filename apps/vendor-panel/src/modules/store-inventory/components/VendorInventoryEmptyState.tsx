import { EmptyState } from '../../../components/common';

export function VendorInventoryEmptyState({
  description = 'Try adjusting your search or filters.',
  title = 'No inventory records',
}: {
  description?: string;
  title?: string;
}) {
  return <EmptyState description={description} title={title} />;
}
