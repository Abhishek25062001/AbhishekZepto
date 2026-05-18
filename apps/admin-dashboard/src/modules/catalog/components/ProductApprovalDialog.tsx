import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Input, Modal } from '../../../components/common';
import { PRODUCT_APPROVAL_STATUS, PRODUCT_APPROVAL_STATUS_LABELS } from '../constants/product.constants';
import {
  productApprovalSchema,
  type ProductApprovalFormValues,
} from '../forms/product-approval.schema';

export { productApprovalSchema } from '../forms/product-approval.schema';
export type { ProductApprovalFormValues } from '../forms/product-approval.schema';

type ProductApprovalDialogProps = {
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductApprovalFormValues) => Promise<void> | void;
  open: boolean;
  productName: string;
};

export function ProductApprovalDialog({
  loading = false,
  onClose,
  onSubmit,
  open,
  productName,
}: ProductApprovalDialogProps) {
  const { formState, handleSubmit, register, watch } = useForm<
    ProductApprovalFormValues,
    unknown,
    ProductApprovalFormValues
  >({
    defaultValues: {
      approvalStatus: PRODUCT_APPROVAL_STATUS.PENDING_REVIEW,
      rejectionReason: '',
    },
    resolver: zodResolver(productApprovalSchema),
  });

  const status = watch('approvalStatus');

  return (
    <Modal
      footer={
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
          <Button disabled={loading} type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button form="product-approval-form" loading={loading} type="submit" variant="primary">
            Update status
          </Button>
        </div>
      }
      open={open}
      title="Update approval status"
      onClose={onClose}
    >
      <form
        id="product-approval-form"
        style={{ display: 'grid', gap: 'var(--spacing-md)' }}
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      >
        <p style={{ marginTop: 0 }}>
          Product: <strong>{productName}</strong>
        </p>
        <div style={{ display: 'grid', gap: '6px' }}>
          <label htmlFor="approval-status">Approval status</label>
          <select
            id="approval-status"
            {...register('approvalStatus')}
            style={{
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-md)',
            }}
          >
            {Object.values(PRODUCT_APPROVAL_STATUS).map((value) => (
              <option key={value} value={value}>
                {PRODUCT_APPROVAL_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        {status === PRODUCT_APPROVAL_STATUS.REJECTED ? (
          <Input
            error={formState.errors.rejectionReason?.message}
            label="Rejection reason"
            {...register('rejectionReason')}
          />
        ) : null}
      </form>
    </Modal>
  );
}
