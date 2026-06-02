import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  SUPPORT_TICKET_CATEGORIES,
  SUPPORT_TICKET_CATEGORY,
  SUPPORT_TICKET_PRIORITIES,
  SUPPORT_TICKET_PRIORITY,
  SUPPORT_TICKET_SOURCES,
  SUPPORT_TICKET_SOURCE,
  SUPPORT_TICKET_STATUSES,
  SUPPORT_TICKET_STATUS,
} from '../constants/support-ticket.constants';
import type { SupportTicketRecord } from '../types/support-ticket.types';

const SupportTicketSchema = new Schema<SupportTicketRecord>(
  {
    ticketNumber: { type: String, required: true, unique: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, default: null, index: true },
    orderId: { type: Schema.Types.ObjectId, default: null, index: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: SUPPORT_TICKET_CATEGORIES,
      default: SUPPORT_TICKET_CATEGORY.GENERAL,
      index: true,
    },
    priority: {
      type: String,
      enum: SUPPORT_TICKET_PRIORITIES,
      default: SUPPORT_TICKET_PRIORITY.MEDIUM,
      index: true,
    },
    status: {
      type: String,
      enum: SUPPORT_TICKET_STATUSES,
      default: SUPPORT_TICKET_STATUS.OPEN,
      index: true,
    },
    source: {
      type: String,
      enum: SUPPORT_TICKET_SOURCES,
      default: SUPPORT_TICKET_SOURCE.ADMIN,
    },
    assignedAdminId: { type: Schema.Types.ObjectId, default: null, index: true },
    createdByAdminId: { type: Schema.Types.ObjectId, default: null },
    lastActivityAt: { type: Date, default: Date.now, index: true },
    resolvedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
    resolutionSummary: { type: String, default: null, trim: true },
    tags: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  baseSchemaOptions as SchemaOptions<SupportTicketRecord>,
);

SupportTicketSchema.index({ status: 1, priority: 1, lastActivityAt: -1 });
SupportTicketSchema.index({ assignedAdminId: 1, status: 1, lastActivityAt: -1 });

export const SupportTicketModel = model<SupportTicketRecord>(
  'SupportTicket',
  SupportTicketSchema,
  COLLECTION_NAMES.SUPPORT_TICKETS,
);
