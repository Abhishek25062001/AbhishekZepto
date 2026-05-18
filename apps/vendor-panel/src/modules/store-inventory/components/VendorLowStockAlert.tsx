import type { VendorInventoryStock } from '../types/vendor-inventory.types';

export function VendorLowStockAlert({ stock }: { stock: Pick<VendorInventoryStock, 'isLowStock' | 'isOutOfStock'> }) {
  if (!stock.isLowStock && !stock.isOutOfStock) {
    return null;
  }

  return (
    <p
      role="status"
      style={{
        background: stock.isOutOfStock ? 'var(--color-error-muted)' : 'var(--color-warning-muted)',
        borderRadius: 'var(--radius-md)',
        margin: 0,
        padding: 'var(--spacing-md)',
      }}
    >
      {stock.isOutOfStock
        ? 'This item is out of stock.'
        : 'This item is below the low-stock threshold.'}
    </p>
  );
}
