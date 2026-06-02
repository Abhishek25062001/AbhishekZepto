import { useState, type FormEvent } from 'react';

import { Button, Input, Modal } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { VENDOR_STATUS_OPTIONS } from '../constants/admin-vendor-store.constants';
import { useUpdateAdminVendorStatusMutation } from '../hooks/useAdminVendorStoreMutations';
import type { AdminVendorSummary, VendorManagementStatus } from '../types/admin-vendor-store.types';
import {
  vendorStatusFormSchema,
  type VendorStatusFormValues,
} from '../validators/vendor-store-form.schema';

type VendorStatusControlProps = {
  onClose: () => void;
  open: boolean;
  vendor: AdminVendorSummary;
};

const selectStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)',
  minHeight: 44,
  padding: 'var(--spacing-sm) var(--spacing-md)',
} as const;

const statusFromVendor = (vendor: AdminVendorSummary): VendorManagementStatus =>
  VENDOR_STATUS_OPTIONS.some(option => option.value === vendor.accountStatus)
    ? (vendor.accountStatus as VendorManagementStatus)
    : 'inactive';

export function VendorStatusControl({ onClose, open, vendor }: VendorStatusControlProps) {
  const [values, setValues] = useState<VendorStatusFormValues>({
    status: statusFromVendor(vendor),
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useUpdateAdminVendorStatusMutation(vendor.vendorId);

  const close = () => {
    setValues({ status: statusFromVendor(vendor), reason: '' });
    setFormError(null);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = vendorStatusFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'A reason is required.');
      return;
    }

    mutation.mutate({
      status: parsed.data.status as VendorManagementStatus,
      reason: parsed.data.reason,
    }, {
      onError: error => setFormError(getApiErrorMessage(error, 'Unable to update vendor status.')),
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
            form="vendor-status-form"
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
      title="Update Vendor Status"
    >
      <form
        id="vendor-status-form"
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
              status: event.target.value as VendorManagementStatus,
            }))}
            style={selectStyle}
            value={values.status}
          >
            {VENDOR_STATUS_OPTIONS.map(option => (
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
