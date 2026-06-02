import { Types } from 'mongoose';

import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { ADMIN_ACTION_TYPE } from '../../admin-control/constants/admin-action-types';
import { AdminActionAuditModel } from '../../admin-control/models/admin-action-audit.model';
import { writeAdminActionAudit } from '../../admin-control/services/admin-audit-log.service';
import {
  SUPPORT_TICKET_SOURCE,
  SUPPORT_TICKET_STATUS,
} from '../constants/support-ticket.constants';
import {
  buildSupportTicketNumber,
  createSupportTicketNoteRecord,
  createSupportTicketRecord,
  findSupportTicketById,
  listSupportTicketNoteRecords,
  listSupportTicketRecords,
  touchSupportTicketActivity,
  updateSupportTicketAssignmentRecord,
  updateSupportTicketPriorityRecord,
  updateSupportTicketStatusRecord,
} from '../repositories/support-ticket.repository';
import type {
  ListSupportTicketsInput,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from '../types/support-ticket.types';
import { mapSupportTicket, mapSupportTicketNote } from './support-ticket.mapper';

type AuditContext = {
  actorAdminId: string | null;
  reason?: string | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
};

const writeSupportAudit = async ({
  audit,
  actionType,
  ticketId,
  beforeState,
  afterState,
  fallbackReason,
}: {
  audit?: AuditContext;
  actionType: typeof ADMIN_ACTION_TYPE[keyof typeof ADMIN_ACTION_TYPE];
  ticketId: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  fallbackReason: string;
}) => {
  if (!audit?.actorAdminId || !Types.ObjectId.isValid(ticketId)) {
    return;
  }

  await writeAdminActionAudit({
    adminId: audit.actorAdminId,
    actionType,
    entityType: 'support_ticket',
    entityId: ticketId,
    beforeState,
    afterState,
    reason: audit.reason ?? fallbackReason,
    ipAddress: audit.ipAddress ?? null,
    deviceInfo: audit.deviceInfo ?? null,
  });
};

export const getSupportTicketOrThrow = async (ticketId: string) => {
  const ticket = await findSupportTicketById(ticketId);

  if (!ticket) {
    throw new AppError({
      message: 'Support ticket not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.SUPPORT_TICKET_NOT_FOUND,
    });
  }

  return ticket;
};

export const createSupportTicketForAdmin = async ({
  customerId,
  orderId,
  subject,
  description,
  category,
  priority,
  assignedAdminId,
  tags,
  adminId,
  audit,
}: {
  customerId?: string | null;
  orderId?: string | null;
  subject: string;
  description: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  assignedAdminId?: string | null;
  tags?: string[];
  adminId: string | null;
  audit?: AuditContext;
}) => {
  const ticket = await createSupportTicketRecord({
    ticketNumber: buildSupportTicketNumber(),
    customerId,
    orderId,
    subject,
    description,
    category,
    priority,
    source: SUPPORT_TICKET_SOURCE.ADMIN,
    assignedAdminId,
    createdByAdminId: adminId,
    tags,
  });
  const mapped = mapSupportTicket(ticket);

  await writeSupportAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.SUPPORT_TICKET_CREATED,
    ticketId: ticket._id.toString(),
    beforeState: {},
    afterState: mapped,
    fallbackReason: 'Support ticket created',
  });

  return mapped;
};

export const listSupportTicketsForAdmin = async (
  input: ListSupportTicketsInput,
) => {
  const { items, total } = await listSupportTicketRecords(input);

  return {
    items: items.map(mapSupportTicket),
    page: input.page,
    limit: input.limit,
    total,
  };
};

export const getSupportTicketForAdmin = async (ticketId: string) => {
  const ticket = await getSupportTicketOrThrow(ticketId);
  return mapSupportTicket(ticket);
};

const SUPPORT_STATUS_TRANSITIONS: Record<SupportTicketStatus, SupportTicketStatus[]> = {
  [SUPPORT_TICKET_STATUS.OPEN]: [
    SUPPORT_TICKET_STATUS.IN_PROGRESS,
    SUPPORT_TICKET_STATUS.RESOLVED,
    SUPPORT_TICKET_STATUS.CLOSED,
  ],
  [SUPPORT_TICKET_STATUS.IN_PROGRESS]: [
    SUPPORT_TICKET_STATUS.OPEN,
    SUPPORT_TICKET_STATUS.RESOLVED,
    SUPPORT_TICKET_STATUS.CLOSED,
  ],
  [SUPPORT_TICKET_STATUS.RESOLVED]: [
    SUPPORT_TICKET_STATUS.IN_PROGRESS,
    SUPPORT_TICKET_STATUS.CLOSED,
  ],
  [SUPPORT_TICKET_STATUS.CLOSED]: [
    SUPPORT_TICKET_STATUS.IN_PROGRESS,
  ],
};

export const updateSupportTicketStatusForAdmin = async ({
  ticketId,
  status,
  resolutionSummary,
  reason,
  audit,
}: {
  ticketId: string;
  status: SupportTicketStatus;
  resolutionSummary?: string | null;
  reason: string;
  audit?: AuditContext;
}) => {
  const ticket = await getSupportTicketOrThrow(ticketId);
  const beforeState = mapSupportTicket(ticket);

  if (ticket.status !== status && !SUPPORT_STATUS_TRANSITIONS[ticket.status].includes(status)) {
    throw new AppError({
      message: 'Support ticket status transition is not allowed',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: ERROR_CODES.SUPPORT_TICKET_INVALID_STATUS_TRANSITION,
    });
  }

  const updated = await updateSupportTicketStatusRecord({
    ticketId,
    status,
    resolutionSummary,
  });

  if (!updated) {
    throw new AppError({
      message: 'Support ticket not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.SUPPORT_TICKET_NOT_FOUND,
    });
  }

  const mapped = mapSupportTicket(updated);
  await writeSupportAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.SUPPORT_TICKET_STATUS_CHANGED,
    ticketId,
    beforeState,
    afterState: mapped,
    fallbackReason: reason,
  });

  return mapped;
};

export const updateSupportTicketPriorityForAdmin = async ({
  ticketId,
  priority,
  reason,
  audit,
}: {
  ticketId: string;
  priority: SupportTicketPriority;
  reason: string;
  audit?: AuditContext;
}) => {
  const ticket = await getSupportTicketOrThrow(ticketId);
  const beforeState = mapSupportTicket(ticket);
  const updated = await updateSupportTicketPriorityRecord({ ticketId, priority });

  if (!updated) {
    throw new AppError({
      message: 'Support ticket not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.SUPPORT_TICKET_NOT_FOUND,
    });
  }

  const mapped = mapSupportTicket(updated);
  await writeSupportAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.SUPPORT_TICKET_PRIORITY_CHANGED,
    ticketId,
    beforeState,
    afterState: mapped,
    fallbackReason: reason,
  });

  return mapped;
};

export const updateSupportTicketAssignmentForAdmin = async ({
  ticketId,
  assignedAdminId,
  reason,
  audit,
}: {
  ticketId: string;
  assignedAdminId: string | null;
  reason: string;
  audit?: AuditContext;
}) => {
  const ticket = await getSupportTicketOrThrow(ticketId);
  const beforeState = mapSupportTicket(ticket);
  const updated = await updateSupportTicketAssignmentRecord({ ticketId, assignedAdminId });

  if (!updated) {
    throw new AppError({
      message: 'Support ticket not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.SUPPORT_TICKET_NOT_FOUND,
    });
  }

  const mapped = mapSupportTicket(updated);
  await writeSupportAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.SUPPORT_TICKET_ASSIGNED,
    ticketId,
    beforeState,
    afterState: mapped,
    fallbackReason: reason,
  });

  return mapped;
};

export const listSupportTicketNotesForAdmin = async (ticketId: string) => {
  await getSupportTicketOrThrow(ticketId);
  const notes = await listSupportTicketNoteRecords(ticketId);
  return notes.map(mapSupportTicketNote);
};

export const createSupportTicketNoteForAdmin = async ({
  ticketId,
  body,
  isInternal,
  adminId,
  audit,
}: {
  ticketId: string;
  body: string;
  isInternal: boolean;
  adminId: string | null;
  audit?: AuditContext;
}) => {
  const ticket = await getSupportTicketOrThrow(ticketId);
  const note = await createSupportTicketNoteRecord({
    ticketId,
    authorAdminId: adminId,
    body,
    isInternal,
  });
  await touchSupportTicketActivity(ticketId);

  const mapped = mapSupportTicketNote(note);
  await writeSupportAudit({
    audit,
    actionType: ADMIN_ACTION_TYPE.SUPPORT_TICKET_NOTE_CREATED,
    ticketId,
    beforeState: mapSupportTicket(ticket),
    afterState: { note: mapped },
    fallbackReason: 'Support ticket note created',
  });

  return mapped;
};

export const listSupportTicketAuditForAdmin = async (ticketId: string) => {
  await getSupportTicketOrThrow(ticketId);

  return AdminActionAuditModel.find({
    entityType: 'support_ticket',
    entityId: new Types.ObjectId(ticketId),
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()
    .exec();
};
