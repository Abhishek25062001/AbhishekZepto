import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  SUPPORT_TICKET_NOTE_TYPE,
  SUPPORT_TICKET_NOTE_TYPES,
} from '../constants/support-ticket.constants';
import type { SupportTicketNoteRecord } from '../types/support-ticket.types';

const SupportTicketNoteSchema = new Schema<SupportTicketNoteRecord>(
  {
    ticketId: { type: Schema.Types.ObjectId, required: true, index: true },
    authorAdminId: { type: Schema.Types.ObjectId, default: null, index: true },
    noteType: {
      type: String,
      enum: SUPPORT_TICKET_NOTE_TYPES,
      default: SUPPORT_TICKET_NOTE_TYPE.NOTE,
    },
    body: { type: String, required: true, trim: true },
    isInternal: { type: Boolean, default: true },
  },
  baseSchemaOptions as SchemaOptions<SupportTicketNoteRecord>,
);

SupportTicketNoteSchema.index({ ticketId: 1, createdAt: -1 });

export const SupportTicketNoteModel = model<SupportTicketNoteRecord>(
  'SupportTicketNote',
  SupportTicketNoteSchema,
  COLLECTION_NAMES.SUPPORT_TICKET_NOTES,
);
