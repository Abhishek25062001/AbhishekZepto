import { z } from 'zod';

import { mongoObjectIdValidator } from '../../../validators/common.validators';
import {
  SUPPORT_TICKET_CATEGORIES,
  SUPPORT_TICKET_PRIORITIES,
  SUPPORT_TICKET_STATUSES,
} from '../constants/support-ticket.constants';

export const supportTicketIdParamValidator = {
  params: z.object({
    ticketId: mongoObjectIdValidator,
  }),
};

export const listSupportTicketsQueryValidator = {
  query: z.object({
    status: z.enum(SUPPORT_TICKET_STATUSES as [string, ...string[]]).optional(),
    priority: z.enum(SUPPORT_TICKET_PRIORITIES as [string, ...string[]]).optional(),
    category: z.enum(SUPPORT_TICKET_CATEGORIES as [string, ...string[]]).optional(),
    customerId: mongoObjectIdValidator.optional(),
    orderId: mongoObjectIdValidator.optional(),
    assignedAdminId: mongoObjectIdValidator.optional(),
    search: z.string().trim().min(1).max(120).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export const createSupportTicketValidator = {
  body: z.object({
    customerId: mongoObjectIdValidator.nullable().optional(),
    orderId: mongoObjectIdValidator.nullable().optional(),
    subject: z.string().trim().min(3).max(160),
    description: z.string().trim().min(5).max(5000),
    category: z.enum(SUPPORT_TICKET_CATEGORIES as [string, ...string[]]),
    priority: z.enum(SUPPORT_TICKET_PRIORITIES as [string, ...string[]]).default('medium'),
    assignedAdminId: mongoObjectIdValidator.nullable().optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  }),
};

export const updateSupportTicketStatusValidator = {
  body: z.object({
    status: z.enum(SUPPORT_TICKET_STATUSES as [string, ...string[]]),
    resolutionSummary: z.string().trim().max(2000).nullable().optional(),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const updateSupportTicketPriorityValidator = {
  body: z.object({
    priority: z.enum(SUPPORT_TICKET_PRIORITIES as [string, ...string[]]),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const updateSupportTicketAssignmentValidator = {
  body: z.object({
    assignedAdminId: mongoObjectIdValidator.nullable(),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const createSupportTicketNoteValidator = {
  body: z.object({
    body: z.string().trim().min(2).max(5000),
    isInternal: z.boolean().default(true),
  }),
};
