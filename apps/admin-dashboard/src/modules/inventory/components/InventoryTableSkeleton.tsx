import { CatalogTableSkeleton } from '../../catalog/components/CatalogTableSkeleton';

export function InventoryTableSkeleton({ columns }: { columns: number }) {
  return <CatalogTableSkeleton columns={columns} />;
}
