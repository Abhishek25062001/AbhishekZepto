import { useState, type FormEvent } from 'react';

import { Button, Card, Input } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { SUPPORT_TICKET_STATUS_OPTIONS } from '../constants/support.constants';
import { useUpdateSupportTicketStatusMutation } from '../hooks/useSupportTicketMutations';
import type { SupportTicket, SupportTicketStatus } from '../types/support.types';
import {
  supportTicketStatusFormSchema,
  type SupportTicketStatusFormValues,
} from '../validators/support-ticket-form.schema';

export function SupportTicketStatusControl({ ticket }: { ticket: SupportTicket }) {
  const [values, setValues] = useState<SupportTicketStatusFormValues>({
    status: ticket.status,
    resolutionSummary: ticket.resolutionSummary ?? '',
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useUpdateSupportTicketStatusMutation(ticket.ticketId);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const parsed = supportTicketStatusFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please check the status fields.');
      return;
    }

    mutation.mutate({
      status: parsed.data.status as SupportTicketStatus,
      resolutionSummary: parsed.data.resolutionSummary || null,
      reason: parsed.data.reason,
    }, {
      onError: error => setFormError(getApiErrorMessage(error, 'Unable to update status.')),
      onSuccess: () => setValues(previous => ({ ...previous, reason: '' })),
    });
  };

  return (
    <Card title="Status">
      <form onSubmit={submit} style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Status</span>
          <select
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({
              ...previous,
              status: event.target.value as SupportTicketStatus,
            }))}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              minHeight: 44,
              padding: 'var(--spacing-sm) var(--spacing-md)',
            }}
            value={values.status}
          >
            {SUPPORT_TICKET_STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <Input
          disabled={mutation.isPending}
          label="Resolution Summary"
          onChange={event => setValues(previous => ({ ...previous, resolutionSummary: event.target.value }))}
          value={values.resolutionSummary ?? ''}
        />
        <Input
          disabled={mutation.isPending}
          label="Reason"
          onChange={event => setValues(previous => ({ ...previous, reason: event.target.value }))}
          required
          value={values.reason}
        />
        <Button loading={mutation.isPending} type="submit">
          Update Status
        </Button>
      </form>
    </Card>
  );
}
