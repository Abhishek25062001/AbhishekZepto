import { Badge } from '../../../components/common';
import {
  INVENTORY_STOCK_STATUS_LABELS,
  STOCK_LEVEL_LABELS,
  type InventoryStockStatus,
  type StockLevelLabel,
} from '../constants/vendor-inventory.constants';

export function VendorInventoryStatusBadge({ status }: { status: InventoryStockStatus }) {
  const variant = status === 'active' ? 'success' : status === 'inactive' ? 'neutral' : 'warning';
  return <Badge variant={variant}>{INVENTORY_STOCK_STATUS_LABELS[status]}</Badge>;
}

export function VendorStockLevelBadge({
  isLowStock,
  isOutOfStock,
}: {
  isLowStock: boolean;
  isOutOfStock: boolean;
}) {
  const level: StockLevelLabel = isOutOfStock
    ? 'out_of_stock'
    : isLowStock
      ? 'low_stock'
      : 'in_stock';
  const variant = isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success';
  return <Badge variant={variant}>{STOCK_LEVEL_LABELS[level]}</Badge>;
}
