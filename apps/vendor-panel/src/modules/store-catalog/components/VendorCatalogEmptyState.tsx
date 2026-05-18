import { EmptyState } from '../../../components/common';

export function VendorCatalogEmptyState({
  description = 'Try adjusting your search or filters.',
  title = 'No items found',
}: {
  description?: string;
  title?: string;
}) {
  return <EmptyState description={description} title={title} />;
}
