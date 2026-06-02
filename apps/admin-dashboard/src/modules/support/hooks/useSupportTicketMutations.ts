import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createSupportTicket,
  createSupportTicketNote,
  updateSupportTicketAssignment,
  updateSupportTicketPriority,
  updateSupportTicketStatus,
} from '../api/support.api';
import type {
  CreateSupportTicketPayload,
  SupportTicketAssignmentPayload,
  SupportTicketNotePayload,
  SupportTicketPriorityPayload,
  SupportTicketStatusPayload,
} from '../types/support.types';
import { supportQueryKeys } from './useSupportTickets';

const invalidateSupportTickets = async (
  queryClient: ReturnType<typeof useQueryClient>,
  ticketId?: string,
) => {
  await queryClient.invalidateQueries({ queryKey: supportQueryKeys.all });
  if (ticketId) {
    await queryClient.invalidateQueries({ queryKey: supportQueryKeys.detail(ticketId) });
    await queryClient.invalidateQueries({ queryKey: supportQueryKeys.notes(ticketId) });
    await queryClient.invalidateQueries({ queryKey: supportQueryKeys.audit(ticketId) });
  }
};

export const useCreateSupportTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSupportTicketPayload) => createSupportTicket(payload),
    onSuccess: async () => invalidateSupportTickets(queryClient),
  });
};

export const useUpdateSupportTicketStatusMutation = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupportTicketStatusPayload) =>
      updateSupportTicketStatus(ticketId, payload),
    onSuccess: async () => invalidateSupportTickets(queryClient, ticketId),
  });
};

export const useUpdateSupportTicketPriorityMutation = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupportTicketPriorityPayload) =>
      updateSupportTicketPriority(ticketId, payload),
    onSuccess: async () => invalidateSupportTickets(queryClient, ticketId),
  });
};

export const useUpdateSupportTicketAssignmentMutation = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupportTicketAssignmentPayload) =>
      updateSupportTicketAssignment(ticketId, payload),
    onSuccess: async () => invalidateSupportTickets(queryClient, ticketId),
  });
};

export const useCreateSupportTicketNoteMutation = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupportTicketNotePayload) => createSupportTicketNote(ticketId, payload),
    onSuccess: async () => invalidateSupportTickets(queryClient, ticketId),
  });
};
