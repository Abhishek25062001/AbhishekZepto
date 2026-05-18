import { CatalogEmptyState } from '../../catalog/components/CatalogEmptyState';

type Props = { description?: string; title?: string };

export function InventoryEmptyState({ description, title = 'No inventory records' }: Props) {
  return <CatalogEmptyState description={description} title={title} />;
}
