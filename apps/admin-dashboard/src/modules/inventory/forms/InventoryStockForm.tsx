import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Input } from '../../../components/common';
import { StoreProductSelect } from '../components/StoreProductSelect';
import { INVENTORY_STOCK_STATUS, INVENTORY_STOCK_STATUS_LABELS } from '../constants/inventory.constants';
import {
  inventoryStockFormSchema,
  type InventoryStockFormInput,
  type InventoryStockFormSchemaValues,
} from './inventory-stock.schema';

export { inventoryStockFormSchema } from './inventory-stock.schema';

type Props = {
  defaultValues?: Partial<InventoryStockFormInput>;
  submitLabel?: string;
  onSubmit: (values: InventoryStockFormSchemaValues) => Promise<void> | void;
};

export function InventoryStockForm({
  defaultValues,
  submitLabel = 'Save stock',
  onSubmit,
}: Props) {
  const { formState, handleSubmit, register, setValue, watch } = useForm<InventoryStockFormInput>({
    defaultValues: {
      damagedQuantity: 0,
      expiredQuantity: 0,
      lowStockThreshold: 0,
      reorderLevel: 0,
      reservedQuantity: 0,
      status: INVENTORY_STOCK_STATUS.ACTIVE,
      ...defaultValues,
    },
    resolver: zodResolver(inventoryStockFormSchema),
  });

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-lg)', maxWidth: 720 }}
      onSubmit={handleSubmit((values) => onSubmit(inventoryStockFormSchema.parse(values)))}
    >
      <StoreProductSelect
        error={formState.errors.storeProductId?.message}
        value={watch('storeProductId')}
        onChange={(id) => setValue('storeProductId', id ?? '', { shouldValidate: true })}
      />
      <Input
        error={formState.errors.availableQuantity?.message}
        label="Available quantity"
        min={0}
        type="number"
        {...register('availableQuantity')}
      />
      <Input label="Reserved quantity" min={0} type="number" {...register('reservedQuantity')} />
      <Input label="Damaged quantity" min={0} type="number" {...register('damagedQuantity')} />
      <Input label="Expired quantity" min={0} type="number" {...register('expiredQuantity')} />
      <Input label="Low stock threshold" min={0} type="number" {...register('lowStockThreshold')} />
      <Input label="Reorder level" min={0} type="number" {...register('reorderLevel')} />
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="inventory-stock-status">Status</label>
        <select
          id="inventory-stock-status"
          {...register('status')}
          style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}
        >
          {Object.values(INVENTORY_STOCK_STATUS).map((status) => (
            <option key={status} value={status}>
              {INVENTORY_STOCK_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="primary">
        {submitLabel}
      </Button>
    </form>
  );
}
