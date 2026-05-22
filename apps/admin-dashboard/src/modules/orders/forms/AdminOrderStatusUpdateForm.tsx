import { useState } from 'react';

import { Button, Input } from '../../../components/common';
import type { AdminOrderStatus } from '../types/admin-orders.types';
import { ADMIN_ORDER_STATUS_LABELS } from '../utils/admin-orders-display.util';
import { adminOrderStatusUpdateSchema } from './admin-order-status-update.schema';
import type { AdminOrderStatusUpdateFormValues } from './admin-order-status-update.schema';

type AdminOrderStatusUpdateFormProps = {
  availableStatuses: AdminOrderStatus[];
  loading?: boolean;
  onSubmit: (values: AdminOrderStatusUpdateFormValues) => void;
};

export function AdminOrderStatusUpdateForm({
  availableStatuses,
  loading = false,
  onSubmit,
}: AdminOrderStatusUpdateFormProps) {
  const [status, setStatus] = useState<AdminOrderStatus>(availableStatuses[0] ?? 'accepted');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = adminOrderStatusUpdateSchema.safeParse({
          reason: reason || undefined,
          status,
        });

        if (!parsed.success) {
          setError('Select a valid status.');
          return;
        }

        setError(null);
        onSubmit(parsed.data);
      }}
    >
      <label style={{ display: 'grid', gap: '6px' }}>
        <span>Status</span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as AdminOrderStatus)}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            minHeight: 44,
            padding: 'var(--spacing-sm) var(--spacing-md)',
          }}
        >
          {availableStatuses.map((nextStatus) => (
            <option key={nextStatus} value={nextStatus}>
              {ADMIN_ORDER_STATUS_LABELS[nextStatus]}
            </option>
          ))}
        </select>
      </label>
      <Input
        error={error ?? undefined}
        label="Reason"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
      <Button loading={loading} type="submit">
        Update status
      </Button>
    </form>
  );
}
