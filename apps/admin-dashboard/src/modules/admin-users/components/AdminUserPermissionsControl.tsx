import { useState, type FormEvent } from 'react';

import { Button, Input, Modal } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { useUpdateAdminUserPermissionsMutation } from '../hooks/useAdminUserMutations';
import type { AdminUserSummary } from '../types/admin-users.types';
import {
  adminUserPermissionsFormSchema,
  type AdminUserPermissionsFormValues,
} from '../validators/admin-user-form.schema';

type AdminUserPermissionsControlProps = {
  onClose: () => void;
  open: boolean;
  user: AdminUserSummary;
};

export function AdminUserPermissionsControl({
  onClose,
  open,
  user,
}: AdminUserPermissionsControlProps) {
  const [values, setValues] = useState<AdminUserPermissionsFormValues>({
    permissions: user.permissions.join(', '),
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useUpdateAdminUserPermissionsMutation(user.adminUserId);

  const close = () => {
    setValues({ permissions: user.permissions.join(', '), reason: '' });
    setFormError(null);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = adminUserPermissionsFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'A reason is required.');
      return;
    }

    mutation.mutate({
      permissions: parsed.data.permissions,
      reason: parsed.data.reason,
    }, {
      onError: error => setFormError(getApiErrorMessage(error, 'Unable to update admin permissions.')),
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
          <Button form="admin-user-permissions-form" loading={mutation.isPending} type="submit">
            Update Permissions
          </Button>
        </div>
      )}
      onClose={close}
      open={open}
      title="Update Direct Permissions"
    >
      <form
        id="admin-user-permissions-form"
        onSubmit={submit}
        style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      >
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <Input
          disabled={mutation.isPending}
          label="Direct Permissions"
          onChange={event => setValues(previous => ({
            ...previous,
            permissions: event.target.value,
          }))}
          placeholder="permissions:read, users:read"
          value={values.permissions}
        />
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
