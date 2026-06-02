import { useState, type FormEvent } from 'react';

import { Button, Input, Modal } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { ADMIN_USER_ROLE_OPTIONS, ADMIN_USER_STATUS_OPTIONS } from '../constants/admin-users.constants';
import { useCreateAdminUserMutation } from '../hooks/useAdminUserMutations';
import type { AdminUserRole, AdminUserStatus, CreateAdminUserPayload } from '../types/admin-users.types';
import { createAdminUserFormSchema, type CreateAdminUserFormValues } from '../validators/admin-user-form.schema';

type CreateAdminUserModalProps = {
  onClose: () => void;
  open: boolean;
};

const defaultValues: CreateAdminUserFormValues = {
  name: '',
  email: '',
  phone: '',
  role: 'operations_admin',
  permissions: '',
  cityScope: '',
  storeScope: '',
  status: 'active',
};

const selectStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)',
  minHeight: 44,
  padding: 'var(--spacing-sm) var(--spacing-md)',
} as const;

const fieldStyle = {
  display: 'grid',
  gap: 6,
} as const;

export function CreateAdminUserModal({ onClose, open }: CreateAdminUserModalProps) {
  const [values, setValues] = useState<CreateAdminUserFormValues>(defaultValues);
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useCreateAdminUserMutation();

  const close = () => {
    setValues(defaultValues);
    setFormError(null);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = createAdminUserFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please check the admin user fields.');
      return;
    }

    const payload: CreateAdminUserPayload = {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone,
      role: parsed.data.role as AdminUserRole,
      permissions: parsed.data.permissions,
      cityScope: parsed.data.cityScope,
      storeScope: parsed.data.storeScope,
      status: parsed.data.status as AdminUserStatus,
    };

    mutation.mutate(payload, {
      onError: error => setFormError(getApiErrorMessage(error, 'Unable to create admin user.')),
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
          <Button form="create-admin-user-form" loading={mutation.isPending} type="submit">
            Create User
          </Button>
        </div>
      )}
      onClose={close}
      open={open}
      title="Create Admin User"
    >
      <form
        id="create-admin-user-form"
        onSubmit={submit}
        style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      >
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <Input
          disabled={mutation.isPending}
          label="Name"
          onChange={event => setValues(previous => ({ ...previous, name: event.target.value }))}
          required
          value={values.name}
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
          required
          value={values.phone}
        />
        <label style={fieldStyle}>
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
        <label style={fieldStyle}>
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
          label="Direct Permissions"
          onChange={event => setValues(previous => ({ ...previous, permissions: event.target.value }))}
          placeholder="permissions:read, users:read"
          value={values.permissions}
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
