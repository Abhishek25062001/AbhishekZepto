import { Card } from '../../../components/common';
import type { VendorInventoryStock } from '../types/vendor-inventory.types';

export function VendorStockSummaryCards({ stock }: { stock: VendorInventoryStock }) {
  const items = [
    { label: 'Available', value: stock.availableQuantity },
    { label: 'Reserved', value: stock.reservedQuantity },
    { label: 'Damaged', value: stock.damagedQuantity },
    { label: 'Expired', value: stock.expiredQuantity },
    { label: 'Total', value: stock.totalQuantity },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--spacing-md)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      }}
    >
      {items.map((item) => (
        <Card key={item.label} title={item.label}>
          <p style={{ fontSize: '1.5rem', margin: 0 }}>{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
