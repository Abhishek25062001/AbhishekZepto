import { useState, type FormEvent } from 'react';

import { Button, Input, Modal } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { ADMIN_USER_ROLE_OPTIONS } from '../constants/admin-users.constants';
import { useUpdateAdminUserRoleMutation } from '../hooks/useAdminUserMutations';
import type { AdminUserRole, AdminUserSummary } from '../types/admin-users.types';
import {
  adminUserRoleFormSchema,
  type AdminUserRoleFormValues,
} from '../validators/admin-user-form.schema';

type AdminUserRoleControlProps = {
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

export function AdminUserRoleControl({ onClose, open, user }: AdminUserRoleControlProps) {
  const [values, setValues] = useState<AdminUserRoleFormValues>({
    role: user.role,
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useUpdateAdminUserRoleMutation(user.adminUserId);

  const close = () => {
    setValues({ role: user.role, reason: '' });
    setFormError(null);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = adminUserRoleFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'A reason is required.');
      return;
    }

    mutation.mutate({
      role: parsed.data.role as AdminUserRole,
      reason: parsed.data.reason,
    }, {
      onError: error => setFormError(getApiErrorMessage(error, 'Unable to update admin role.')),
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
          <Button form="admin-user-role-form" loading={mutation.isPending} type="submit">
            Update Role
          </Button>
        </div>
      )}
      onClose={close}
      open={open}
      title="Update Admin User Role"
    >
      <form
        id="admin-user-role-form"
        onSubmit={submit}
        style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      >
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Role</span>
          <select
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({
              ...previous,
              role: event.target.value as AdminUserRole,
            }))}
            style={selectStyle}
            value={values.role}
          >
            {ADMIN_USER_ROLE_OPTIONS.map(option => (
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
