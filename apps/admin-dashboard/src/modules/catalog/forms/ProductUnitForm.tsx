import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Input } from '../../../components/common';
import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import { BASE_UNIT, BASE_UNIT_LABELS } from '../constants/product-unit.constants';
import {
  productUnitFormSchema,
  type ProductUnitFormInput,
  type ProductUnitFormSchemaValues,
} from './product-unit-form.schema';

export { productUnitFormSchema } from './product-unit-form.schema';
export type { ProductUnitFormInput, ProductUnitFormSchemaValues } from './product-unit-form.schema';

type ProductUnitFormProps = {
  defaultValues?: Partial<ProductUnitFormInput>;
  submitLabel?: string;
  onSubmit: (values: ProductUnitFormSchemaValues) => Promise<void> | void;
};

export function ProductUnitForm({
  defaultValues,
  submitLabel = 'Save unit',
  onSubmit,
}: ProductUnitFormProps) {
  const { formState, handleSubmit, register } = useForm<
    ProductUnitFormInput,
    unknown,
    ProductUnitFormSchemaValues
  >({
    defaultValues: {
      baseUnit: BASE_UNIT.PIECE,
      code: '',
      conversionFactor: 1,
      name: '',
      status: CATALOG_STATUS.ACTIVE,
      ...defaultValues,
    },
    resolver: zodResolver(productUnitFormSchema),
  });

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-lg)', maxWidth: 720 }}
      onSubmit={handleSubmit(async (values) => onSubmit(values))}
    >
      <Input error={formState.errors.code?.message} label="Code" {...register('code')} />
      <Input error={formState.errors.name?.message} label="Name" {...register('name')} />
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="unit-base">Base unit</label>
        <select
          id="unit-base"
          {...register('baseUnit')}
          style={{
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
          }}
        >
          {Object.values(BASE_UNIT).map((unit) => (
            <option key={unit} value={unit}>
              {BASE_UNIT_LABELS[unit]}
            </option>
          ))}
        </select>
      </div>
      <Input
        error={formState.errors.conversionFactor?.message}
        label="Conversion factor"
        type="number"
        step="any"
        {...register('conversionFactor', { valueAsNumber: true })}
      />
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="unit-status">Status</label>
        <select
          id="unit-status"
          {...register('status')}
          style={{
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
          }}
        >
          <option value={CATALOG_STATUS.ACTIVE}>Active</option>
          <option value={CATALOG_STATUS.INACTIVE}>Inactive</option>
          <option value={CATALOG_STATUS.ARCHIVED}>Archived</option>
        </select>
      </div>
      <Button type="submit" variant="primary">
        {submitLabel}
      </Button>
    </form>
  );
}
