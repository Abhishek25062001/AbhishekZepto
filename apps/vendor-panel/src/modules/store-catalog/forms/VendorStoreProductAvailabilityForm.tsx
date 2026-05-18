import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/common';
import { STORE_PRODUCT_STATUS, STORE_PRODUCT_STATUS_LABELS } from '../constants/vendor-store-product.constants';
import type { VendorStoreProduct } from '../types/vendor-store-product.types';
import {
  vendorStoreProductAvailabilitySchema,
  type VendorStoreProductAvailabilityInput,
  type VendorStoreProductAvailabilityValues,
} from './vendor-store-product-availability.schema';

type Props = {
  initial: VendorStoreProduct;
  loading?: boolean;
  onSubmit: (values: VendorStoreProductAvailabilityValues) => Promise<void> | void;
};

export function VendorStoreProductAvailabilityForm({ initial, loading, onSubmit }: Props) {
  const { formState, handleSubmit, register, setValue, watch } = useForm<
    VendorStoreProductAvailabilityInput,
    unknown,
    VendorStoreProductAvailabilityValues
  >({
    defaultValues: {
      isAvailable: initial.isAvailable,
      isVisible: initial.isVisible,
      status: initial.status,
    },
    resolver: zodResolver(vendorStoreProductAvailabilitySchema),
  });

  const current = watch();

  const hasChanges =
    current.isAvailable !== initial.isAvailable ||
    current.isVisible !== initial.isVisible ||
    current.status !== initial.status;

  return (
    <form style={{ display: 'grid', gap: 'var(--spacing-md)' }} onSubmit={handleSubmit(onSubmit)}>
      <label style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <input
          checked={Boolean(current.isAvailable)}
          type="checkbox"
          onChange={(event) => setValue('isAvailable', event.target.checked, { shouldDirty: true })}
        />
        Available
      </label>
      <label style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <input
          checked={Boolean(current.isVisible)}
          type="checkbox"
          onChange={(event) => setValue('isVisible', event.target.checked, { shouldDirty: true })}
        />
        Visible
      </label>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="availability-status">Status</label>
        <select id="availability-status" {...register('status')} style={{ padding: 'var(--spacing-md)' }}>
          {Object.values(STORE_PRODUCT_STATUS).map((status) => (
            <option key={status} value={status}>
              {STORE_PRODUCT_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      {formState.errors.root?.message ? <p role="alert">{formState.errors.root.message}</p> : null}
      <Button disabled={loading || !hasChanges || formState.isSubmitting} type="submit" variant="primary">
        {loading || formState.isSubmitting ? 'Saving…' : 'Save availability'}
      </Button>
    </form>
  );
}
