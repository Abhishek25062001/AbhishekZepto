import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  CreateSupportTicketPayload,
  SupportTicket,
  SupportTicketAssignmentPayload,
  SupportTicketAuditRecord,
  SupportTicketListQuery,
  SupportTicketListResponse,
  SupportTicketListResult,
  SupportTicketNote,
  SupportTicketNotePayload,
  SupportTicketPriorityPayload,
  SupportTicketStatusPayload,
} from '../types/support.types';

const BASE = '/api/v1/admin/support/tickets';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

const toPagination = (data: SupportTicketListResponse): SupportTicketListResult => {
  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return {
    items: data.items,
    pagination: {
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages,
      hasNextPage: data.page < totalPages,
      hasPreviousPage: data.page > 1,
    },
  };
};

export const listSupportTickets = async (
  query: SupportTicketListQuery = {},
): Promise<SupportTicketListResult> => {
  const response = await apiClient.get<ApiSuccessResponse<SupportTicketListResponse>>(BASE, {
    params: query,
  });
  return toPagination(response.data.data);
};

export const createSupportTicket = async (
  payload: CreateSupportTicketPayload,
): Promise<SupportTicket> => {
  const response = await apiClient.post<ApiSuccessResponse<SupportTicket>>(BASE, payload);
  return unwrapData(response.data);
};

export const getSupportTicket = async (ticketId: string): Promise<SupportTicket> => {
  const response = await apiClient.get<ApiSuccessResponse<SupportTicket>>(`${BASE}/${ticketId}`);
  return unwrapData(response.data);
};

export const updateSupportTicketStatus = async (
  ticketId: string,
  payload: SupportTicketStatusPayload,
): Promise<SupportTicket> => {
  const response = await apiClient.patch<ApiSuccessResponse<SupportTicket>>(
    `${BASE}/${ticketId}/status`,
    payload,
  );
  return unwrapData(response.data);
};

export const updateSupportTicketPriority = async (
  ticketId: string,
  payload: SupportTicketPriorityPayload,
): Promise<SupportTicket> => {
  const response = await apiClient.patch<ApiSuccessResponse<SupportTicket>>(
    `${BASE}/${ticketId}/priority`,
    payload,
  );
  return unwrapData(response.data);
};

export const updateSupportTicketAssignment = async (
  ticketId: string,
  payload: SupportTicketAssignmentPayload,
): Promise<SupportTicket> => {
  const response = await apiClient.patch<ApiSuccessResponse<SupportTicket>>(
    `${BASE}/${ticketId}/assignment`,
    payload,
  );
  return unwrapData(response.data);
};

export const listSupportTicketNotes = async (
  ticketId: string,
): Promise<SupportTicketNote[]> => {
  const response = await apiClient.get<ApiSuccessResponse<SupportTicketNote[]>>(
    `${BASE}/${ticketId}/notes`,
  );
  return unwrapData(response.data);
};

export const createSupportTicketNote = async (
  ticketId: string,
  payload: SupportTicketNotePayload,
): Promise<SupportTicketNote> => {
  const response = await apiClient.post<ApiSuccessResponse<SupportTicketNote>>(
    `${BASE}/${ticketId}/notes`,
    payload,
  );
  return unwrapData(response.data);
};

export const listSupportTicketAudit = async (
  ticketId: string,
): Promise<SupportTicketAuditRecord[]> => {
  const response = await apiClient.get<ApiSuccessResponse<SupportTicketAuditRecord[]>>(
    `${BASE}/${ticketId}/audit`,
  );
  return unwrapData(response.data);
};
