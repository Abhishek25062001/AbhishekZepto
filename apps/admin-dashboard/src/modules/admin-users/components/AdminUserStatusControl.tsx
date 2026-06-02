import { useState, type FormEvent } from 'react';

import { Button, Input, Modal } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { ADMIN_USER_STATUS_OPTIONS } from '../constants/admin-users.constants';
import { useUpdateAdminUserStatusMutation } from '../hooks/useAdminUserMutations';
import type { AdminUserStatus, AdminUserSummary } from '../types/admin-users.types';
import {
  adminUserStatusFormSchema,
  type AdminUserStatusFormValues,
} from '../validators/admin-user-form.schema';

type AdminUserStatusControlProps = {
  onClose: () => void;
  open: boolean;
  user: AdminUserSummary;
};

const selectStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)',
  minHeight: 44,
  padding: 'var(--spacing-sm) var(--spacing-md)',
} as const;

export function AdminUserStatusControl({ onClose, open, user }: AdminUserStatusControlProps) {
  const [values, setValues] = useState<AdminUserStatusFormValues>({
    status: user.status,
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useUpdateAdminUserStatusMutation(user.adminUserId);

  const close = () => {
    setValues({ status: user.status, reason: '' });
    setFormError(null);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = adminUserStatusFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'A reason is required.');
      return;
    }

    mutation.mutate({
      status: parsed.data.status as AdminUserStatus,
      reason: parsed.data.reason,
    }, {
      onError: error => setFormError(getApiErrorMessage(error, 'Unable to update admin status.')),
      onSuccess: close,
    });
  };

  return (
    <Modal
      footer={(
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
          <Button disabled={mutation.isPending} onClick={close} type="button" variant="ghost">
            Cancel
          </Button>
          <Button form="admin-user-status-form" loading={mutation.isPending} type="submit" variant="danger">
            Update Status
          </Button>
        </div>
      )}
      onClose={close}
      open={open}
      title="Update Admin User Status"
    >
      <form
        id="admin-user-status-form"
        onSubmit={submit}
        style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      >
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Status</span>
          <select
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({
              ...previous,
              status: event.target.value as AdminUserStatus,
            }))}
            style={selectStyle}
            value={values.status}
          >
            {ADMIN_USER_STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <Input
          disabled={mutation.isPending}
          label="Reason"
          onChange={event => setValues(previous => ({ ...previous, reason: event.target.value }))}
          required
          value={values.reason}
        />
      </form>
    </Modal>
  );
}
