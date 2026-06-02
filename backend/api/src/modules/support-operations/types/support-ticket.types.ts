import type { HydratedDocument, Types } from 'mongoose';

import type {
  SUPPORT_TICKET_CATEGORY,
  SUPPORT_TICKET_NOTE_TYPE,
  SUPPORT_TICKET_PRIORITY,
  SUPPORT_TICKET_SOURCE,
  SUPPORT_TICKET_STATUS,
} from '../constants/support-ticket.constants';

export type SupportTicketStatus =
  (typeof SUPPORT_TICKET_STATUS)[keyof typeof SUPPORT_TICKET_STATUS];

export type SupportTicketPriority =
  (typeof SUPPORT_TICKET_PRIORITY)[keyof typeof SUPPORT_TICKET_PRIORITY];

export type SupportTicketCategory =
  (typeof SUPPORT_TICKET_CATEGORY)[keyof typeof SUPPORT_TICKET_CATEGORY];

export type SupportTicketSource =
  (typeof SUPPORT_TICKET_SOURCE)[keyof typeof SUPPORT_TICKET_SOURCE];

export type SupportTicketNoteType =
  (typeof SUPPORT_TICKET_NOTE_TYPE)[keyof typeof SUPPORT_TICKET_NOTE_TYPE];

export type SupportTicketRecord = {
  _id: Types.ObjectId;
  ticketNumber: string;
  customerId?: Types.ObjectId | null;
  orderId?: Types.ObjectId | null;
  subject: string;
  description: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  source: SupportTicketSource;
  assignedAdminId?: Types.ObjectId | null;
  createdByAdminId?: Types.ObjectId | null;
  lastActivityAt: Date;
  resolvedAt?: Date | null;
  closedAt?: Date | null;
  resolutionSummary?: string | null;
  tags: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SupportTicketDocument = HydratedDocument<SupportTicketRecord>;

export type SupportTicketNoteRecord = {
  _id: Types.ObjectId;
  ticketId: Types.ObjectId;
  authorAdminId?: Types.ObjectId | null;
  noteType: SupportTicketNoteType;
  body: string;
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SupportTicketNoteDocument = HydratedDocument<SupportTicketNoteRecord>;

export type CreateSupportTicketInput = {
  ticketNumber: string;
  customerId?: string | null;
  orderId?: string | null;
  subject: string;
  description: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  source: SupportTicketSource;
  assignedAdminId?: string | null;
  createdByAdminId?: string | null;
  tags?: string[];
};

export type ListSupportTicketsInput = {
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  category?: SupportTicketCategory;
  customerId?: string;
  orderId?: string;
  assignedAdminId?: string;
  search?: string;
  page: number;
  limit: number;
};
