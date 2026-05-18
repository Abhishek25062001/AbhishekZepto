import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Input } from '../../../components/common';
import { ADJUSTMENT_MODE, MOVEMENT_TYPE, MOVEMENT_TYPE_LABELS } from '../constants/inventory.constants';
import {
  inventoryAdjustmentFormSchema,
  type InventoryAdjustmentFormInput,
  type InventoryAdjustmentFormSchemaValues,
} from './inventory-adjustment.schema';

export { inventoryAdjustmentFormSchema } from './inventory-adjustment.schema';

type Props = {
  submitLabel?: string;
  onSubmit: (values: InventoryAdjustmentFormSchemaValues) => Promise<void> | void;
};

export function InventoryAdjustmentForm({ submitLabel = 'Adjust stock', onSubmit }: Props) {
  const { formState, handleSubmit, register, watch } = useForm<
    InventoryAdjustmentFormInput,
    unknown,
    InventoryAdjustmentFormSchemaValues
  >({
    defaultValues: {
      adjustmentMode: ADJUSTMENT_MODE.ADD,
      movementType: MOVEMENT_TYPE.MANUAL_ADJUSTMENT,
    },
    resolver: zodResolver(inventoryAdjustmentFormSchema),
  });

  const movementType = watch('movementType');

  return (
    <form style={{ display: 'grid', gap: 'var(--spacing-md)' }} onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="movement-type">Movement type</label>
        <select id="movement-type" {...register('movementType')} style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
          {Object.values(MOVEMENT_TYPE).map((type) => (
            <option key={type} value={type}>
              {MOVEMENT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>
      {movementType === MOVEMENT_TYPE.MANUAL_ADJUSTMENT ? (
        <div style={{ display: 'grid', gap: '6px' }}>
          <label htmlFor="adjustment-mode">Adjustment mode</label>
          <select id="adjustment-mode" {...register('adjustmentMode')} style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
            {Object.values(ADJUSTMENT_MODE).map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <Input error={formState.errors.quantity?.message} label="Quantity" min={1} type="number" {...register('quantity')} />
      <Input error={formState.errors.reason?.message} label="Reason" {...register('reason')} />
      <Input label="Notes" {...register('notes')} />
      <Button type="submit" variant="primary">
        {submitLabel}
      </Button>
    </form>
  );
}
