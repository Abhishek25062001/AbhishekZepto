import { z } from 'zod';

import {
  SUPPORT_TICKET_CATEGORY_OPTIONS,
  SUPPORT_TICKET_PRIORITY_OPTIONS,
  SUPPORT_TICKET_STATUS_OPTIONS,
} from '../constants/support.constants';

const categoryValues = SUPPORT_TICKET_CATEGORY_OPTIONS.map(option => option.value) as [string, ...string[]];
const priorityValues = SUPPORT_TICKET_PRIORITY_OPTIONS.map(option => option.value) as [string, ...string[]];
const statusValues = SUPPORT_TICKET_STATUS_OPTIONS.map(option => option.value) as [string, ...string[]];

export const csvListSchema = z.string().transform(value =>
  value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean),
);

const optionalIdSchema = z.string().trim().max(80).transform(value => value || null);

export const createSupportTicketFormSchema = z.object({
  customerId: optionalIdSchema.optional(),
  orderId: optionalIdSchema.optional(),
  subject: z.string().trim().min(3).max(160),
  description: z.string().trim().min(5).max(5000),
  category: z.enum(categoryValues),
  priority: z.enum(priorityValues),
  assignedAdminId: optionalIdSchema.optional(),
  tags: csvListSchema,
});

export type CreateSupportTicketFormValues = z.input<typeof createSupportTicketFormSchema>;

export const supportTicketStatusFormSchema = z.object({
  status: z.enum(statusValues),
  resolutionSummary: z.string().trim().max(2000).or(z.literal('')).optional(),
  reason: z.string().trim().min(5).max(500),
});

export type SupportTicketStatusFormValues = z.input<typeof supportTicketStatusFormSchema>;

export const supportTicketPriorityFormSchema = z.object({
  priority: z.enum(priorityValues),
  reason: z.string().trim().min(5).max(500),
});

export type SupportTicketPriorityFormValues = z.input<typeof supportTicketPriorityFormSchema>;

export const supportTicketAssignmentFormSchema = z.object({
  assignedAdminId: optionalIdSchema,
  reason: z.string().trim().min(5).max(500),
});

export type SupportTicketAssignmentFormValues = z.input<typeof supportTicketAssignmentFormSchema>;

export const supportTicketNoteFormSchema = z.object({
  body: z.string().trim().min(2).max(5000),
  isInternal: z.boolean().default(true),
});

export type SupportTicketNoteFormValues = z.input<typeof supportTicketNoteFormSchema>;
