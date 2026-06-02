import { useState, type FormEvent } from 'react';

import { Button, Input, Modal } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import {
  SUPPORT_TICKET_CATEGORY_OPTIONS,
  SUPPORT_TICKET_PRIORITY_OPTIONS,
} from '../constants/support.constants';
import { useCreateSupportTicketMutation } from '../hooks/useSupportTicketMutations';
import type {
  CreateSupportTicketPayload,
  SupportTicketCategory,
  SupportTicketPriority,
} from '../types/support.types';
import {
  createSupportTicketFormSchema,
  type CreateSupportTicketFormValues,
} from '../validators/support-ticket-form.schema';

type CreateSupportTicketModalProps = {
  onClose: () => void;
  open: boolean;
};

const defaultValues: CreateSupportTicketFormValues = {
  customerId: '',
  orderId: '',
  subject: '',
  description: '',
  category: 'general',
  priority: 'medium',
  assignedAdminId: '',
  tags: '',
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

export function CreateSupportTicketModal({ onClose, open }: CreateSupportTicketModalProps) {
  const [values, setValues] = useState<CreateSupportTicketFormValues>(defaultValues);
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useCreateSupportTicketMutation();

  const close = () => {
    setValues(defaultValues);
    setFormError(null);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = createSupportTicketFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please check the support ticket fields.');
      return;
    }

    const payload: CreateSupportTicketPayload = {
      customerId: parsed.data.customerId,
      orderId: parsed.data.orderId,
      subject: parsed.data.subject,
      description: parsed.data.description,
      category: parsed.data.category as SupportTicketCategory,
      priority: parsed.data.priority as SupportTicketPriority,
      assignedAdminId: parsed.data.assignedAdminId,
      tags: parsed.data.tags,
    };

    mutation.mutate(payload, {
      onError: error => setFormError(getApiErrorMessage(error, 'Unable to create support ticket.')),
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
          <Button form="create-support-ticket-form" loading={mutation.isPending} type="submit">
            Create Ticket
          </Button>
        </div>
      )}
      onClose={close}
      open={open}
      title="Create Support Ticket"
    >
      <form
        id="create-support-ticket-form"
        onSubmit={submit}
        style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      >
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <Input
          disabled={mutation.isPending}
          label="Subject"
          onChange={event => setValues(previous => ({ ...previous, subject: event.target.value }))}
          required
          value={values.subject}
        />
        <label style={fieldStyle}>
          <span>Description</span>
          <textarea
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({ ...previous, description: event.target.value }))}
            required
            rows={5}
            style={{ ...selectStyle, resize: 'vertical' }}
            value={values.description}
          />
        </label>
        <label style={fieldStyle}>
          <span>Category</span>
          <select
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({
              ...previous,
              category: event.target.value as SupportTicketCategory,
            }))}
            style={selectStyle}
            value={values.category}
          >
            {SUPPORT_TICKET_CATEGORY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label style={fieldStyle}>
          <span>Priority</span>
          <select
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({
              ...previous,
              priority: event.target.value as SupportTicketPriority,
            }))}
            style={selectStyle}
            value={values.priority}
          >
            {SUPPORT_TICKET_PRIORITY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <Input
          disabled={mutation.isPending}
          label="Customer ID"
          onChange={event => setValues(previous => ({ ...previous, customerId: event.target.value }))}
          value={values.customerId ?? ''}
        />
        <Input
          disabled={mutation.isPending}
          label="Order ID"
          onChange={event => setValues(previous => ({ ...previous, orderId: event.target.value }))}
          value={values.orderId ?? ''}
        />
        <Input
          disabled={mutation.isPending}
          label="Assigned Admin ID"
          onChange={event => setValues(previous => ({ ...previous, assignedAdminId: event.target.value }))}
          value={values.assignedAdminId ?? ''}
        />
        <Input
          disabled={mutation.isPending}
          label="Tags"
          onChange={event => setValues(previous => ({ ...previous, tags: event.target.value }))}
          placeholder="Comma-separated labels"
          value={values.tags}
        />
      </form>
    </Modal>
  );
}
