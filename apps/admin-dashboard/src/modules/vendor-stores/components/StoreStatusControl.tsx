import { useState, type FormEvent } from 'react';

import { Button, Input, Modal } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { STORE_STATUS_OPTIONS } from '../constants/admin-vendor-store.constants';
import { useUpdateAdminStoreStatusMutation } from '../hooks/useAdminVendorStoreMutations';
import type { AdminStoreSummary, StoreManagementStatus } from '../types/admin-vendor-store.types';
import {
  storeStatusFormSchema,
  type StoreStatusFormValues,
} from '../validators/vendor-store-form.schema';

type StoreStatusControlProps = {
  onClose: () => void;
  open: boolean;
  store: AdminStoreSummary;
};

const selectStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)',
  minHeight: 44,
  padding: 'var(--spacing-sm) var(--spacing-md)',
} as const;

const statusFromStore = (store: AdminStoreSummary): StoreManagementStatus =>
  STORE_STATUS_OPTIONS.some(option => option.value === store.status)
    ? (store.status as StoreManagementStatus)
    : 'inactive';

export function StoreStatusControl({ onClose, open, store }: StoreStatusControlProps) {
  const [values, setValues] = useState<StoreStatusFormValues>({
    status: statusFromStore(store),
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useUpdateAdminStoreStatusMutation(store.storeId);

  const close = () => {
    setValues({ status: statusFromStore(store), reason: '' });
    setFormError(null);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = storeStatusFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'A reason is required.');
      return;
    }

    mutation.mutate({
      status: parsed.data.status as StoreManagementStatus,
      reason: parsed.data.reason,
    }, {
      onError: error => setFormError(getApiErrorMessage(error, 'Unable to update store status.')),
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
          <Button
            form="store-status-form"
            loading={mutation.isPending}
            type="submit"
            variant="danger"
          >
            Update Status
          </Button>
        </div>
      )}
      onClose={close}
      open={open}
      title="Update Store Status"
    >
      <form
        id="store-status-form"
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
              status: event.target.value as StoreManagementStatus,
            }))}
            style={selectStyle}
            value={values.status}
          >
            {STORE_STATUS_OPTIONS.map(option => (
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
