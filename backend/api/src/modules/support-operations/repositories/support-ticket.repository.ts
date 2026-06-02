import { Types } from 'mongoose';

import {
  SUPPORT_TICKET_NOTE_TYPE,
  SUPPORT_TICKET_SOURCE,
  SUPPORT_TICKET_STATUS,
} from '../constants/support-ticket.constants';
import { SupportTicketModel } from '../models/support-ticket.model';
import { SupportTicketNoteModel } from '../models/support-ticket-note.model';
import type {
  CreateSupportTicketInput,
  ListSupportTicketsInput,
  SupportTicketNoteType,
  SupportTicketPriority,
  SupportTicketStatus,
} from '../types/support-ticket.types';

const toObjectId = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }

  return new Types.ObjectId(value);
};

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildSupportTicketNumber = (date = new Date()): string => {
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
  const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SUP-${datePart}-${entropy}`;
};

export const createSupportTicketRecord = (input: CreateSupportTicketInput) => {
  return SupportTicketModel.create({
    ticketNumber: input.ticketNumber,
    customerId: toObjectId(input.customerId),
    orderId: toObjectId(input.orderId),
    subject: input.subject,
    description: input.description,
    category: input.category,
    priority: input.priority,
    status: SUPPORT_TICKET_STATUS.OPEN,
    source: input.source ?? SUPPORT_TICKET_SOURCE.ADMIN,
    assignedAdminId: toObjectId(input.assignedAdminId),
    createdByAdminId: toObjectId(input.createdByAdminId),
    lastActivityAt: new Date(),
    tags: input.tags ?? [],
  });
};

export const findSupportTicketById = (ticketId: string) => {
  if (!Types.ObjectId.isValid(ticketId)) {
    return Promise.resolve(null);
  }

  return SupportTicketModel.findOne({
    _id: new Types.ObjectId(ticketId),
    isDeleted: false,
  }).exec();
};

export const listSupportTicketRecords = async ({
  status,
  priority,
  category,
  customerId,
  orderId,
  assignedAdminId,
  search,
  page,
  limit,
}: ListSupportTicketsInput) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (customerId && Types.ObjectId.isValid(customerId)) filter.customerId = new Types.ObjectId(customerId);
  if (orderId && Types.ObjectId.isValid(orderId)) filter.orderId = new Types.ObjectId(orderId);
  if (assignedAdminId && Types.ObjectId.isValid(assignedAdminId)) {
    filter.assignedAdminId = new Types.ObjectId(assignedAdminId);
  }

  if (search?.trim()) {
    const pattern = escapeRegex(search.trim());
    filter.$or = [
      { ticketNumber: { $regex: pattern, $options: 'i' } },
      { subject: { $regex: pattern, $options: 'i' } },
      { description: { $regex: pattern, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    SupportTicketModel.find(filter).sort({ lastActivityAt: -1 }).skip(skip).limit(limit).exec(),
    SupportTicketModel.countDocuments(filter).exec(),
  ]);

  return { items, total };
};

export const updateSupportTicketStatusRecord = ({
  ticketId,
  status,
  resolutionSummary,
}: {
  ticketId: string;
  status: SupportTicketStatus;
  resolutionSummary?: string | null;
}) => {
  const now = new Date();
  return SupportTicketModel.findOneAndUpdate(
    { _id: new Types.ObjectId(ticketId), isDeleted: false },
    {
      $set: {
        status,
        resolutionSummary: resolutionSummary ?? null,
        resolvedAt: status === SUPPORT_TICKET_STATUS.RESOLVED ? now : null,
        closedAt: status === SUPPORT_TICKET_STATUS.CLOSED ? now : null,
        lastActivityAt: now,
      },
    },
    { new: true },
  ).exec();
};

export const updateSupportTicketPriorityRecord = ({
  ticketId,
  priority,
}: {
  ticketId: string;
  priority: SupportTicketPriority;
}) => {
  return SupportTicketModel.findOneAndUpdate(
    { _id: new Types.ObjectId(ticketId), isDeleted: false },
    { $set: { priority, lastActivityAt: new Date() } },
    { new: true },
  ).exec();
};

export const updateSupportTicketAssignmentRecord = ({
  ticketId,
  assignedAdminId,
}: {
  ticketId: string;
  assignedAdminId: string | null;
}) => {
  return SupportTicketModel.findOneAndUpdate(
    { _id: new Types.ObjectId(ticketId), isDeleted: false },
    { $set: { assignedAdminId: toObjectId(assignedAdminId), lastActivityAt: new Date() } },
    { new: true },
  ).exec();
};

export const createSupportTicketNoteRecord = ({
  ticketId,
  authorAdminId,
  body,
  noteType = SUPPORT_TICKET_NOTE_TYPE.NOTE,
  isInternal = true,
}: {
  ticketId: string;
  authorAdminId?: string | null;
  body: string;
  noteType?: SupportTicketNoteType;
  isInternal?: boolean;
}) => {
  return SupportTicketNoteModel.create({
    ticketId: new Types.ObjectId(ticketId),
    authorAdminId: toObjectId(authorAdminId),
    noteType,
    body,
    isInternal,
  });
};

export const touchSupportTicketActivity = (ticketId: string) => {
  if (!Types.ObjectId.isValid(ticketId)) {
    return Promise.resolve(null);
  }

  return SupportTicketModel.findOneAndUpdate(
    { _id: new Types.ObjectId(ticketId), isDeleted: false },
    { $set: { lastActivityAt: new Date() } },
    { new: true },
  ).exec();
};

export const listSupportTicketNoteRecords = (ticketId: string) => {
  if (!Types.ObjectId.isValid(ticketId)) {
    return Promise.resolve([]);
  }

  return SupportTicketNoteModel.find({ ticketId: new Types.ObjectId(ticketId) })
    .sort({ createdAt: -1 })
    .limit(100)
    .exec();
};
