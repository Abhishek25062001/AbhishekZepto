import { Button, Modal } from '../../../components/common';

type ConfirmDeleteDialogProps = {
  description?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  title?: string;
};

export function ConfirmDeleteDialog({
  description = 'This action cannot be undone.',
  loading = false,
  onClose,
  onConfirm,
  open,
  title = 'Delete this record?',
}: ConfirmDeleteDialogProps) {
  return (
    <Modal
      footer={
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
          <Button disabled={loading} type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} type="button" variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      }
      open={open}
      title={title}
      onClose={onClose}
    >
      <p style={{ marginTop: 0 }}>{description}</p>
    </Modal>
  );
}
