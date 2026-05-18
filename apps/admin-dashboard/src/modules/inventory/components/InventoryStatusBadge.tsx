import { Badge } from '../../../components/common';
import type { InventoryStockStatus } from '../constants/inventory.constants';
import { INVENTORY_STOCK_STATUS_LABELS } from '../constants/inventory.constants';
import type { StoreProductStatus } from '../constants/store-product.constants';
import { STORE_PRODUCT_STATUS_LABELS } from '../constants/store-product.constants';

const stockVariant: Record<InventoryStockStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  active: 'success',
  archived: 'error',
  inactive: 'warning',
};

const productVariant: Record<StoreProductStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  active: 'success',
  archived: 'error',
  inactive: 'warning',
};

export function InventoryStockStatusBadge({ status }: { status: InventoryStockStatus }) {
  return <Badge variant={stockVariant[status]}>{INVENTORY_STOCK_STATUS_LABELS[status]}</Badge>;
}

export function StoreProductStatusBadge({ status }: { status: StoreProductStatus }) {
  return <Badge variant={productVariant[status]}>{STORE_PRODUCT_STATUS_LABELS[status]}</Badge>;
}

export function StockLevelBadge({
  isLowStock,
  isOutOfStock,
}: {
  isLowStock: boolean;
  isOutOfStock: boolean;
}) {
  if (isOutOfStock) {
    return <Badge variant="error">Out of stock</Badge>;
  }
  if (isLowStock) {
    return <Badge variant="warning">Low stock</Badge>;
  }
  return <Badge variant="success">In stock</Badge>;
}
