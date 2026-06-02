import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { Button, Input } from '../../../components/common';
import { getAdminProducts, getAdminProductVariants } from '../../catalog/api/product.api';
import { StoreSelect } from '../../stores/components/StoreSelect';
import {
  DISCOUNT_TYPE,
  DISCOUNT_TYPE_LABELS,
  STORE_PRODUCT_STATUS,
  STORE_PRODUCT_STATUS_LABELS,
} from '../constants/store-product.constants';
import {
  storeProductFormSchema,
  type StoreProductFormInput,
  type StoreProductFormSchemaValues,
} from './store-product.schema';

export { storeProductFormSchema } from './store-product.schema';

type StoreProductFormProps = {
  defaultValues?: Partial<StoreProductFormInput>;
  submitLabel?: string;
  onSubmit: (values: StoreProductFormSchemaValues) => Promise<void> | void;
};

export function StoreProductForm({
  defaultValues,
  submitLabel = 'Save mapping',
  onSubmit,
}: StoreProductFormProps) {
  const { formState, handleSubmit, register, setValue, watch } = useForm<StoreProductFormInput>({
    defaultValues: {
      discountType: DISCOUNT_TYPE.NONE,
      discountValue: 0,
      isAvailable: true,
      isFeatured: false,
      isVisible: true,
      status: STORE_PRODUCT_STATUS.ACTIVE,
      ...defaultValues,
    },
    resolver: zodResolver(storeProductFormSchema),
  });

  const storeId = watch('storeId');
  const productId = watch('productId');

  const productsQuery = useQuery({
    queryKey: ['admin-catalog-product-options'],
    queryFn: () => getAdminProducts({ limit: 500, sortBy: 'createdAt', sortOrder: 'asc' }),
  });

  const variantsQuery = useQuery({
    enabled: Boolean(productId),
    queryKey: ['admin-catalog-variant-options', productId],
    queryFn: () => getAdminProductVariants(productId),
  });

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-lg)', maxWidth: 720 }}
      onSubmit={handleSubmit((values) => onSubmit(storeProductFormSchema.parse(values)))}
    >
      <StoreSelect
        error={formState.errors.storeId?.message}
        value={storeId}
        onChange={(id) => setValue('storeId', id ?? '', { shouldValidate: true })}
      />
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="store-product-product">Product</label>
        <select
          id="store-product-product"
          value={productId ?? ''}
          onChange={(event) => {
            const next = event.target.value;
            setValue('productId', next, { shouldValidate: true });
            setValue('variantId', '');
          }}
          style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}
        >
          <option value="">Select product</option>
          {(productsQuery.data?.items ?? []).map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {formState.errors.productId ? (
          <span style={{ color: 'var(--color-error)' }}>{formState.errors.productId.message}</span>
        ) : null}
      </div>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="store-product-variant">Variant</label>
        <select
          disabled={!productId}
          id="store-product-variant"
          value={watch('variantId') ?? ''}
          onChange={(event) => setValue('variantId', event.target.value, { shouldValidate: true })}
          style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}
        >
          <option value="">Select variant</option>
          {(variantsQuery.data ?? []).map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.variantName} ({variant.sku})
            </option>
          ))}
        </select>
        {formState.errors.variantId ? (
          <span style={{ color: 'var(--color-error)' }}>{formState.errors.variantId.message}</span>
        ) : null}
      </div>
      <Input error={formState.errors.storeSku?.message} label="Store SKU" {...register('storeSku')} />
      <Input error={formState.errors.mrp?.message} label="MRP" step="any" type="number" {...register('mrp')} />
      <Input
        error={formState.errors.sellingPrice?.message}
        label="Selling price"
        step="any"
        type="number"
        {...register('sellingPrice')}
      />
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="discount-type">Discount type</label>
        <select id="discount-type" {...register('discountType')} style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
          {Object.values(DISCOUNT_TYPE).map((type) => (
            <option key={type} value={type}>
              {DISCOUNT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>
      <Input
        error={formState.errors.discountValue?.message}
        label="Discount value"
        step="any"
        type="number"
        {...register('discountValue')}
      />
      <label style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <input type="checkbox" {...register('isAvailable')} />
        Available
      </label>
      <label style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <input type="checkbox" {...register('isVisible')} />
        Visible
      </label>
      <label style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <input type="checkbox" {...register('isFeatured')} />
        Featured
      </label>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="store-product-status">Status</label>
        <select id="store-product-status" {...register('status')} style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
          {Object.values(STORE_PRODUCT_STATUS).map((status) => (
            <option key={status} value={status}>
              {STORE_PRODUCT_STATUS_LABELS[status]}
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
