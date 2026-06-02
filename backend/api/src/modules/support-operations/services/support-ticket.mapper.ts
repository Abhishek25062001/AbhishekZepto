import type {
  SupportTicketNoteRecord,
  SupportTicketRecord,
} from '../types/support-ticket.types';

const toIso = (value?: Date | null): string | null => value?.toISOString() ?? null;
const toStringId = (value?: { toString: () => string } | null): string | null =>
  value ? value.toString() : null;

export const mapSupportTicket = (ticket: SupportTicketRecord) => ({
  ticketId: ticket._id.toString(),
  ticketNumber: ticket.ticketNumber,
  customerId: toStringId(ticket.customerId),
  orderId: toStringId(ticket.orderId),
  subject: ticket.subject,
  description: ticket.description,
  category: ticket.category,
  priority: ticket.priority,
  status: ticket.status,
  source: ticket.source,
  assignedAdminId: toStringId(ticket.assignedAdminId),
  createdByAdminId: toStringId(ticket.createdByAdminId),
  lastActivityAt: toIso(ticket.lastActivityAt),
  resolvedAt: toIso(ticket.resolvedAt),
  closedAt: toIso(ticket.closedAt),
  resolutionSummary: ticket.resolutionSummary ?? null,
  tags: ticket.tags,
  createdAt: ticket.createdAt.toISOString(),
  updatedAt: ticket.updatedAt.toISOString(),
});

export const mapSupportTicketNote = (note: SupportTicketNoteRecord) => ({
  noteId: note._id.toString(),
  ticketId: note.ticketId.toString(),
  authorAdminId: toStringId(note.authorAdminId),
  noteType: note.noteType,
  body: note.body,
  isInternal: note.isInternal,
  createdAt: note.createdAt.toISOString(),
  updatedAt: note.updatedAt.toISOString(),
});
