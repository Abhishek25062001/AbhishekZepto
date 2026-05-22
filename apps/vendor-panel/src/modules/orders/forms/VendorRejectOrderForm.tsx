import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/common';
import {
  vendorRejectOrderSchema,
  type VendorRejectOrderInput,
  type VendorRejectOrderValues,
} from './vendor-reject-order.schema';

type VendorRejectOrderFormProps = {
  loading?: boolean;
  onSubmit: (values: VendorRejectOrderValues) => Promise<void> | void;
};

export function VendorRejectOrderForm({ loading = false, onSubmit }: VendorRejectOrderFormProps) {
  const { formState, handleSubmit, register } = useForm<
    VendorRejectOrderInput,
    unknown,
    VendorRejectOrderValues
  >({
    defaultValues: { reason: '' },
    resolver: zodResolver(vendorRejectOrderSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
      <label htmlFor="reject-order-reason">Reject reason</label>
      <textarea
        id="reject-order-reason"
        {...register('reason')}
        maxLength={500}
        rows={3}
        style={{ padding: 'var(--spacing-md)', resize: 'vertical' }}
      />
      {formState.errors.reason?.message ? (
        <p role="alert">{formState.errors.reason.message}</p>
      ) : null}
      <Button loading={loading || formState.isSubmitting} type="submit" variant="danger">
        Reject order
      </Button>
    </form>
  );
}
