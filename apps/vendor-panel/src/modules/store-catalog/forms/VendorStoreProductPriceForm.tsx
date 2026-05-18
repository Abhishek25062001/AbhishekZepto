import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Input } from '../../../components/common';
import { DISCOUNT_TYPE, DISCOUNT_TYPE_LABELS } from '../constants/vendor-store-product.constants';
import type { VendorStoreProduct } from '../types/vendor-store-product.types';
import {
  vendorStoreProductPriceSchema,
  type VendorStoreProductPriceInput,
  type VendorStoreProductPriceValues,
} from './vendor-store-product-price.schema';

type Props = {
  initial: VendorStoreProduct;
  loading?: boolean;
  onSubmit: (values: VendorStoreProductPriceValues) => Promise<void> | void;
};

export function VendorStoreProductPriceForm({ initial, loading, onSubmit }: Props) {
  const locked = initial.isPriceLocked;
  const { formState, handleSubmit, register } = useForm<
    VendorStoreProductPriceInput,
    unknown,
    VendorStoreProductPriceValues
  >({
    defaultValues: {
      discountType: initial.discountType,
      discountValue: initial.discountValue,
      mrp: initial.mrp,
      sellingPrice: initial.sellingPrice,
    },
    resolver: zodResolver(vendorStoreProductPriceSchema),
  });

  return (
    <form style={{ display: 'grid', gap: 'var(--spacing-md)' }} onSubmit={handleSubmit(onSubmit)}>
      {locked ? (
        <p role="status" style={{ color: 'var(--color-warning)', margin: 0 }}>
          Price is locked and cannot be updated.
        </p>
      ) : null}
      <Input
        disabled={locked}
        error={formState.errors.mrp?.message}
        label="MRP"
        min={0}
        step="0.01"
        type="number"
        {...register('mrp')}
      />
      <Input
        disabled={locked}
        error={formState.errors.sellingPrice?.message}
        label="Selling price"
        min={0}
        step="0.01"
        type="number"
        {...register('sellingPrice')}
      />
      <DiscountFields disabled={locked} register={register} />
      <Button
        disabled={locked || loading || formState.isSubmitting}
        type="submit"
        variant="primary"
      >
        {loading || formState.isSubmitting ? 'Saving…' : 'Save price'}
      </Button>
    </form>
  );
}

function DiscountFields({
  disabled,
  register,
}: {
  disabled: boolean;
  register: ReturnType<typeof useForm<VendorStoreProductPriceInput>>['register'];
}) {
  return (
    <>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="discount-type">Discount type</label>
        <select
          disabled={disabled}
          id="discount-type"
          {...register('discountType')}
          style={{ padding: 'var(--spacing-md)' }}
        >
          {Object.values(DISCOUNT_TYPE).map((type) => (
            <option key={type} value={type}>
              {DISCOUNT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>
      <Input
        disabled={disabled}
        label="Discount value"
        min={0}
        step="0.01"
        type="number"
        {...register('discountValue')}
      />
    </>
  );
}
