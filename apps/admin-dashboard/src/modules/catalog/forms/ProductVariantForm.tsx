import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Input } from '../../../components/common';
import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import type { ProductVariantResponse } from '../types/product-variant.types';
import {
  productVariantFormSchema,
  type ProductVariantFormInput,
  type ProductVariantFormSchemaValues,
} from './product-variant-form.schema';

export { productVariantFormSchema } from './product-variant-form.schema';
export type { ProductVariantFormInput, ProductVariantFormSchemaValues } from './product-variant-form.schema';

type ProductVariantFormProps = {
  defaultValues?: Partial<ProductVariantFormInput>;
  loading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (values: ProductVariantFormSchemaValues) => Promise<void> | void;
};

export const buildProductVariantFormDefaults = (
  variant?: ProductVariantResponse,
): Partial<ProductVariantFormInput> => ({
  barcode: variant?.barcode ?? '',
  defaultSellingPrice: variant?.defaultSellingPrice ?? null,
  heightCm: variant?.heightCm ?? null,
  imageUrl: variant?.imageUrl ?? '',
  isDefault: variant?.isDefault ?? false,
  isVisible: variant?.isVisible ?? true,
  lengthCm: variant?.lengthCm ?? null,
  mrp: variant?.mrp ?? 0,
  sku: variant?.sku ?? '',
  status: variant?.status ?? CATALOG_STATUS.ACTIVE,
  unit: variant?.unit ?? '',
  unitValue: variant?.unitValue ?? 1,
  variantName: variant?.variantName ?? '',
  weightInGrams: variant?.weightInGrams ?? null,
  widthCm: variant?.widthCm ?? null,
});

export function ProductVariantForm({
  defaultValues,
  loading = false,
  onCancel,
  onSubmit,
  submitLabel = 'Save variant',
}: ProductVariantFormProps) {
  const { formState, handleSubmit, register } = useForm<
    ProductVariantFormInput,
    unknown,
    ProductVariantFormSchemaValues
  >({
    defaultValues: {
      ...buildProductVariantFormDefaults(),
      ...defaultValues,
    },
    resolver: zodResolver(productVariantFormSchema),
  });

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-md)', maxWidth: 760 }}
      onSubmit={handleSubmit(async (values) => onSubmit(values))}
    >
      <Input error={formState.errors.variantName?.message} label="Variant name" {...register('variantName')} />
      <Input error={formState.errors.sku?.message} label="SKU" {...register('sku')} />
      <Input error={formState.errors.barcode?.message} label="Barcode" {...register('barcode')} />
      <Input error={formState.errors.unit?.message} label="Unit" {...register('unit')} />
      <Input error={formState.errors.unitValue?.message} label="Unit value" step="any" type="number" {...register('unitValue', { valueAsNumber: true })} />
      <Input error={formState.errors.mrp?.message} label="MRP" step="any" type="number" {...register('mrp', { valueAsNumber: true })} />
      <Input error={formState.errors.defaultSellingPrice?.message} label="Default selling price" step="any" type="number" {...register('defaultSellingPrice', { valueAsNumber: true })} />
      <Input error={formState.errors.weightInGrams?.message} label="Weight in grams" step="any" type="number" {...register('weightInGrams', { valueAsNumber: true })} />
      <Input error={formState.errors.imageUrl?.message} label="Image URL" {...register('imageUrl')} />
      <label style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <input type="checkbox" {...register('isDefault')} />
        Default variant
      </label>
      <label style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <input type="checkbox" {...register('isVisible')} />
        Visible
      </label>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="variant-status">Status</label>
        <select id="variant-status" {...register('status')} style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
          <option value={CATALOG_STATUS.ACTIVE}>Active</option>
          <option value={CATALOG_STATUS.INACTIVE}>Inactive</option>
          <option value={CATALOG_STATUS.ARCHIVED}>Archived</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
        <Button loading={loading} type="submit" variant="primary">
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button disabled={loading} type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
