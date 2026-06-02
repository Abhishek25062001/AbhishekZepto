import { useState, type FormEvent } from 'react';

import { Button, Card, Input } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { SUPPORT_TICKET_PRIORITY_OPTIONS } from '../constants/support.constants';
import { useUpdateSupportTicketPriorityMutation } from '../hooks/useSupportTicketMutations';
import type { SupportTicket, SupportTicketPriority } from '../types/support.types';
import {
  supportTicketPriorityFormSchema,
  type SupportTicketPriorityFormValues,
} from '../validators/support-ticket-form.schema';

export function SupportTicketPriorityControl({ ticket }: { ticket: SupportTicket }) {
  const [values, setValues] = useState<SupportTicketPriorityFormValues>({
    priority: ticket.priority,
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useUpdateSupportTicketPriorityMutation(ticket.ticketId);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const parsed = supportTicketPriorityFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please check the priority fields.');
      return;
    }

    mutation.mutate({
      priority: parsed.data.priority as SupportTicketPriority,
      reason: parsed.data.reason,
    }, {
      onError: error => setFormError(getApiErrorMessage(error, 'Unable to update priority.')),
      onSuccess: () => setValues(previous => ({ ...previous, reason: '' })),
    });
  };

  return (
    <Card title="Priority">
      <form onSubmit={submit} style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Priority</span>
          <select
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({
              ...previous,
              priority: event.target.value as SupportTicketPriority,
            }))}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              minHeight: 44,
              padding: 'var(--spacing-sm) var(--spacing-md)',
            }}
            value={values.priority}
          >
            {SUPPORT_TICKET_PRIORITY_OPTIONS.map(option => (
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
        <Button loading={mutation.isPending} type="submit">
          Update Priority
        </Button>
      </form>
    </Card>
  );
}
