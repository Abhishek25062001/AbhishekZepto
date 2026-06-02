import { useState, type FormEvent } from 'react';

import { Button, Card, Input } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { useUpdateSupportTicketAssignmentMutation } from '../hooks/useSupportTicketMutations';
import type { SupportTicket } from '../types/support.types';
import {
  supportTicketAssignmentFormSchema,
  type SupportTicketAssignmentFormValues,
} from '../validators/support-ticket-form.schema';

export function SupportTicketAssignmentControl({ ticket }: { ticket: SupportTicket }) {
  const [values, setValues] = useState<SupportTicketAssignmentFormValues>({
    assignedAdminId: ticket.assignedAdminId ?? '',
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useUpdateSupportTicketAssignmentMutation(ticket.ticketId);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const parsed = supportTicketAssignmentFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please check the assignment fields.');
      return;
    }

    mutation.mutate({
      assignedAdminId: parsed.data.assignedAdminId,
      reason: parsed.data.reason,
    }, {
      onError: error => setFormError(getApiErrorMessage(error, 'Unable to update assignment.')),
      onSuccess: () => setValues(previous => ({ ...previous, reason: '' })),
    });
  };

  return (
    <Card title="Assignment">
      <form onSubmit={submit} style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <Input
          disabled={mutation.isPending}
          label="Assigned Admin ID"
          onChange={event => setValues(previous => ({ ...previous, assignedAdminId: event.target.value }))}
          placeholder="Leave blank to unassign"
          value={values.assignedAdminId ?? ''}
        />
        <Input
          disabled={mutation.isPending}
          label="Reason"
          onChange={event => setValues(previous => ({ ...previous, reason: event.target.value }))}
          required
          value={values.reason}
        />
        <Button loading={mutation.isPending} type="submit">
          Update Assignment
        </Button>
      </form>
    </Card>
  );
}
