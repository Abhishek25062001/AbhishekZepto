import { CatalogErrorState } from '../../catalog/components/CatalogErrorState';

type Props = { message: string; onRetry?: () => void };

export function InventoryErrorState({ message, onRetry }: Props) {
  return <CatalogErrorState message={message} onRetry={onRetry} />;
}
