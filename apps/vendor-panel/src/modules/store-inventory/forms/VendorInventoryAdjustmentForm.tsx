import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Input } from '../../../components/common';
import { VENDOR_MOVEMENT_TYPE, VENDOR_MOVEMENT_TYPE_LABELS } from '../constants/vendor-inventory.constants';
import {
  vendorInventoryAdjustmentSchema,
  type VendorInventoryAdjustmentInput,
  type VendorInventoryAdjustmentValues,
} from './vendor-inventory-adjustment.schema';

type Props = {
  availableQuantity?: number;
  loading?: boolean;
  onSubmit: (values: VendorInventoryAdjustmentValues) => Promise<void> | void;
};

export function VendorInventoryAdjustmentForm({ availableQuantity, loading, onSubmit }: Props) {
  const { formState, handleSubmit, register, watch } = useForm<
    VendorInventoryAdjustmentInput,
    unknown,
    VendorInventoryAdjustmentValues
  >({
    defaultValues: { movementType: VENDOR_MOVEMENT_TYPE.STOCK_IN },
    resolver: zodResolver(vendorInventoryAdjustmentSchema),
  });

  const movementType = watch('movementType');
  const quantity = Number(watch('quantity') ?? 0);
  const exceedsAvailable =
    movementType === VENDOR_MOVEMENT_TYPE.STOCK_OUT &&
    availableQuantity !== undefined &&
    quantity > availableQuantity;

  return (
    <form style={{ display: 'grid', gap: 'var(--spacing-md)' }} onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="movement-type">Movement type</label>
        <select id="movement-type" {...register('movementType')} style={{ padding: 'var(--spacing-md)' }}>
          {Object.values(VENDOR_MOVEMENT_TYPE).map((type) => (
            <option key={type} value={type}>
              {VENDOR_MOVEMENT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>
      <Input
        error={formState.errors.quantity?.message}
        label="Quantity"
        min={1}
        type="number"
        {...register('quantity')}
      />
      {exceedsAvailable ? (
        <p role="status" style={{ color: 'var(--color-warning)', margin: 0 }}>
          Quantity exceeds available stock ({availableQuantity}).
        </p>
      ) : null}
      <Input error={formState.errors.reason?.message} label="Reason" {...register('reason')} />
      <Input label="Notes" {...register('notes')} />
      <Button disabled={loading || formState.isSubmitting} type="submit" variant="primary">
        {loading || formState.isSubmitting ? 'Submitting…' : 'Submit adjustment'}
      </Button>
    </form>
  );
}
