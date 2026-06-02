import { useState, type FormEvent } from 'react';

import { Button, Input, Modal } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { useUpdateAdminUserMutation } from '../hooks/useAdminUserMutations';
import type { AdminUserSummary, UpdateAdminUserPayload } from '../types/admin-users.types';
import {
  updateAdminUserFormSchema,
  type UpdateAdminUserFormValues,
} from '../validators/admin-user-form.schema';

type EditAdminUserModalProps = {
  onClose: () => void;
  open: boolean;
  user: AdminUserSummary;
};

const valuesFromUser = (user: AdminUserSummary): UpdateAdminUserFormValues => ({
  name: user.name ?? '',
  email: user.email ?? '',
  phone: user.phone,
  cityScope: user.cityScope.join(', '),
  storeScope: user.storeScope.join(', '),
});

export function EditAdminUserModal({ onClose, open, user }: EditAdminUserModalProps) {
  const [values, setValues] = useState<UpdateAdminUserFormValues>(() => valuesFromUser(user));
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useUpdateAdminUserMutation(user.adminUserId);

  const close = () => {
    setValues(valuesFromUser(user));
    setFormError(null);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = updateAdminUserFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please check the admin user fields.');
      return;
    }

    const payload: UpdateAdminUserPayload = {
      name: parsed.data.name || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || undefined,
      cityScope: parsed.data.cityScope,
      storeScope: parsed.data.storeScope,
    };

    mutation.mutate(payload, {
      onError: error => setFormError(getApiErrorMessage(error, 'Unable to update admin user.')),
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
          <Button form="edit-admin-user-form" loading={mutation.isPending} type="submit">
            Save Changes
          </Button>
        </div>
      )}
      onClose={close}
      open={open}
      title="Edit Admin User"
    >
      <form
        id="edit-admin-user-form"
        onSubmit={submit}
        style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      >
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <Input
          disabled={mutation.isPending}
          label="Name"
          onChange={event => setValues(previous => ({ ...previous, name: event.target.value }))}
          value={values.name ?? ''}
        />
        <Input
          disabled={mutation.isPending}
          label="Email"
          onChange={event => setValues(previous => ({ ...previous, email: event.target.value }))}
          type="email"
          value={values.email ?? ''}
        />
        <Input
          disabled={mutation.isPending}
          label="Phone"
          onChange={event => setValues(previous => ({ ...previous, phone: event.target.value }))}
          value={values.phone ?? ''}
        />
        <Input
          disabled={mutation.isPending}
          label="City Scope"
          onChange={event => setValues(previous => ({ ...previous, cityScope: event.target.value }))}
          placeholder="Comma-separated city ids"
          value={values.cityScope}
        />
        <Input
          disabled={mutation.isPending}
          label="Store Scope"
          onChange={event => setValues(previous => ({ ...previous, storeScope: event.target.value }))}
          placeholder="Comma-separated store ids"
          value={values.storeScope}
        />
      </form>
    </Modal>
  );
}
