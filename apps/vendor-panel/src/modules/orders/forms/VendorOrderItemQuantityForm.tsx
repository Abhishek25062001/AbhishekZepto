import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/common';
import {
  vendorOrderItemQuantitySchema,
  type VendorOrderItemQuantityInput,
  type VendorOrderItemQuantityValues,
} from './vendor-order-item-quantity.schema';

type VendorOrderItemQuantityFormProps = {
  buttonLabel: string;
  inputId: string;
  label: string;
  loading?: boolean;
  maxQuantity: number;
  onSubmit: (values: VendorOrderItemQuantityValues) => Promise<void> | void;
};

export function VendorOrderItemQuantityForm({
  buttonLabel,
  inputId,
  label,
  loading = false,
  maxQuantity,
  onSubmit,
}: VendorOrderItemQuantityFormProps) {
  const { formState, handleSubmit, register } = useForm<
    VendorOrderItemQuantityInput,
    unknown,
    VendorOrderItemQuantityValues
  >({
    defaultValues: { quantity: 1 },
    resolver: zodResolver(vendorOrderItemQuantitySchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        {...register('quantity')}
        max={maxQuantity}
        min={1}
        step={1}
        style={{ maxWidth: 96, padding: 'var(--spacing-sm)' }}
        type="number"
      />
      {formState.errors.quantity?.message ? (
        <p role="alert">{formState.errors.quantity.message}</p>
      ) : null}
      <Button loading={loading || formState.isSubmitting} size="sm" type="submit" variant="outline">
        {buttonLabel}
      </Button>
    </form>
  );
}
