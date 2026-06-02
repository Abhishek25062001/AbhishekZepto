import { useState, type FormEvent } from 'react';

import { CanAccessAny } from '../../../components/auth/CanAccessAny';
import { Button, Card } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { useCreateSupportTicketNoteMutation } from '../hooks/useSupportTicketMutations';
import { useSupportTicketNotes } from '../hooks/useSupportTicketNotes';
import { formatSupportDate, formatSupportLabel } from '../utils/support-display.util';
import {
  supportTicketNoteFormSchema,
  type SupportTicketNoteFormValues,
} from '../validators/support-ticket-form.schema';

const SUPPORT_TICKET_NOTE_CREATE_PERMISSIONS = ['support:update', 'settings:manage'] as const;

export function SupportTicketNotesPanel({ ticketId }: { ticketId: string }) {
  const { data: notes = [], error, isLoading, refetch } = useSupportTicketNotes(ticketId);
  const [values, setValues] = useState<SupportTicketNoteFormValues>({ body: '', isInternal: true });
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useCreateSupportTicketNoteMutation(ticketId);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const parsed = supportTicketNoteFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please check the note body.');
      return;
    }

    mutation.mutate({
      body: parsed.data.body,
      isInternal: parsed.data.isInternal,
    }, {
      onError: noteError => setFormError(getApiErrorMessage(noteError, 'Unable to create note.')),
      onSuccess: () => {
        setValues({ body: '', isInternal: true });
        void refetch();
      },
    });
  };

  return (
    <Card title="Notes">
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        {error ? (
          <p role="alert" style={{ color: 'var(--color-error)' }}>
            {getApiErrorMessage(error, 'Unable to load notes.')}
          </p>
        ) : null}
        {isLoading ? <p>Loading notes...</p> : null}
        {!isLoading && notes.length === 0 ? <p>No notes found.</p> : null}
        {notes.map(note => (
          <article
            key={note.noteId}
            style={{
              borderBottom: '1px solid var(--color-border)',
              display: 'grid',
              gap: 4,
              paddingBottom: 'var(--spacing-md)',
            }}
          >
            <strong>{formatSupportLabel(note.noteType)}</strong>
            <p style={{ margin: 0 }}>{note.body}</p>
            <span style={{ color: 'var(--color-text-secondary)' }}>
              {formatSupportDate(note.createdAt)} · {note.authorAdminId ?? 'Unknown admin'}
            </span>
          </article>
        ))}
        <CanAccessAny permissions={SUPPORT_TICKET_NOTE_CREATE_PERMISSIONS}>
          <form onSubmit={submit} style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Internal Note</span>
              <textarea
                disabled={mutation.isPending}
                onChange={event => setValues(previous => ({ ...previous, body: event.target.value }))}
                required
                rows={4}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  minHeight: 96,
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  resize: 'vertical',
                }}
                value={values.body}
              />
            </label>
            <Button loading={mutation.isPending} type="submit">
              Add Note
            </Button>
          </form>
        </CanAccessAny>
      </div>
    </Card>
  );
}
