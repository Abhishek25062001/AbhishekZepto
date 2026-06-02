import type { SupportTicketPriority, SupportTicketStatus } from '../types/support.types';

export const formatSupportLabel = (value?: string | null) =>
  value ? value.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()) : 'Unassigned';

export const formatSupportDate = (value?: string | null) => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const getSupportStatusVariant = (status: SupportTicketStatus) => {
  if (status === 'resolved') return 'success';
  if (status === 'closed') return 'neutral';
  if (status === 'in_progress') return 'info';
  return 'warning';
};

export const getSupportPriorityVariant = (priority: SupportTicketPriority) => {
  if (priority === 'urgent') return 'error';
  if (priority === 'high') return 'warning';
  if (priority === 'medium') return 'info';
  return 'neutral';
};
