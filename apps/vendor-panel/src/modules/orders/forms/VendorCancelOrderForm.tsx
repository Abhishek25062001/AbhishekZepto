import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/common';
import {
  vendorCancelOrderSchema,
  type VendorCancelOrderInput,
  type VendorCancelOrderValues,
} from './vendor-cancel-order.schema';

type VendorCancelOrderFormProps = {
  loading?: boolean;
  onSubmit: (values: VendorCancelOrderValues) => Promise<void> | void;
};

export function VendorCancelOrderForm({ loading = false, onSubmit }: VendorCancelOrderFormProps) {
  const { formState, handleSubmit, register } = useForm<
    VendorCancelOrderInput,
    unknown,
    VendorCancelOrderValues
  >({
    defaultValues: { reason: '' },
    resolver: zodResolver(vendorCancelOrderSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
      <label htmlFor="cancel-order-reason">Cancellation reason</label>
      <textarea
        id="cancel-order-reason"
        {...register('reason')}
        maxLength={500}
        rows={3}
        style={{ padding: 'var(--spacing-md)', resize: 'vertical' }}
      />
      {formState.errors.reason?.message ? (
        <p role="alert">{formState.errors.reason.message}</p>
      ) : null}
      <Button loading={loading || formState.isSubmitting} type="submit" variant="danger">
        Cancel order
      </Button>
    </form>
  );
}
