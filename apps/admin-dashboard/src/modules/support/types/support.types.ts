import type { ApiPaginationMeta } from '../../../types/api.types';

export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type SupportTicketCategory = 'order' | 'payment' | 'delivery' | 'account' | 'general';

export type SupportTicket = {
  ticketId: string;
  ticketNumber: string;
  customerId: string | null;
  orderId: string | null;
  subject: string;
  description: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  source: string;
  assignedAdminId: string | null;
  createdByAdminId: string | null;
  lastActivityAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  resolutionSummary: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type SupportTicketListQuery = {
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  category?: SupportTicketCategory;
  customerId?: string;
  orderId?: string;
  assignedAdminId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type SupportTicketListResponse = {
  items: SupportTicket[];
  page: number;
  limit: number;
  total: number;
};

export type SupportTicketListResult = {
  items: SupportTicket[];
  pagination: ApiPaginationMeta;
};

export type CreateSupportTicketPayload = {
  customerId?: string | null;
  orderId?: string | null;
  subject: string;
  description: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  assignedAdminId?: string | null;
  tags?: string[];
};

export type SupportTicketStatusPayload = {
  status: SupportTicketStatus;
  resolutionSummary?: string | null;
  reason: string;
};

export type SupportTicketPriorityPayload = {
  priority: SupportTicketPriority;
  reason: string;
};

export type SupportTicketAssignmentPayload = {
  assignedAdminId: string | null;
  reason: string;
};

export type SupportTicketNotePayload = {
  body: string;
  isInternal?: boolean;
};

export type SupportTicketNote = {
  noteId: string;
  ticketId: string;
  authorAdminId: string | null;
  noteType: string;
  body: string;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SupportTicketAuditRecord = {
  adminId: string;
  actionType: string;
  entityType: 'support_ticket';
  entityId: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  reason: string;
  ipAddress: string | null;
  deviceInfo: string | null;
  createdAt: string;
  updatedAt: string;
};
