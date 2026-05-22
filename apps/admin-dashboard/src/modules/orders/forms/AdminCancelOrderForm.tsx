import { useState } from 'react';

import { Button, Input } from '../../../components/common';
import { adminCancelOrderSchema } from './admin-cancel-order.schema';
import type { AdminCancelOrderFormValues } from './admin-cancel-order.schema';

type AdminCancelOrderFormProps = {
  loading?: boolean;
  onSubmit: (values: AdminCancelOrderFormValues) => void;
};

export function AdminCancelOrderForm({ loading = false, onSubmit }: AdminCancelOrderFormProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = adminCancelOrderSchema.safeParse({ reason });

        if (!parsed.success) {
          setError('Cancellation reason is required.');
          return;
        }

        setError(null);
        onSubmit(parsed.data);
      }}
    >
      <Input
        error={error ?? undefined}
        label="Cancellation reason"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
      <Button loading={loading} type="submit" variant="danger">
        Cancel order
      </Button>
    </form>
  );
}
