import type { Request, Response } from 'express';

import { sendCreatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  createSupportTicketForAdmin,
  createSupportTicketNoteForAdmin,
  getSupportTicketForAdmin,
  listSupportTicketAuditForAdmin,
  listSupportTicketNotesForAdmin,
  listSupportTicketsForAdmin,
  updateSupportTicketAssignmentForAdmin,
  updateSupportTicketPriorityForAdmin,
  updateSupportTicketStatusForAdmin,
} from '../services/support-operations.service';

const auditContext = (req: Request, reason?: string | null) => ({
  actorAdminId: req.user?.userId ?? null,
  reason: reason ?? null,
  ipAddress: req.ip ?? null,
  deviceInfo: req.get('user-agent') ?? null,
});

export const createSupportTicketController = asyncHandler(async (req: Request, res: Response) => {
  const result = await createSupportTicketForAdmin({
    ...(req.body as Parameters<typeof createSupportTicketForAdmin>[0]),
    adminId: req.user?.userId ?? null,
    audit: auditContext(req, 'Support ticket created'),
  });

  return sendCreatedResponse({
    res,
    message: 'Support ticket created successfully',
    data: result,
  });
});

export const listSupportTicketsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await listSupportTicketsForAdmin(
    req.query as unknown as Parameters<typeof listSupportTicketsForAdmin>[0],
  );

  return sendSuccessResponse({
    res,
    message: 'Support tickets fetched successfully',
    data: result,
  });
});

export const getSupportTicketController = asyncHandler(async (req: Request, res: Response) => {
  const { ticketId } = req.params as { ticketId: string };
  const result = await getSupportTicketForAdmin(ticketId);

  return sendSuccessResponse({
    res,
    message: 'Support ticket fetched successfully',
    data: result,
  });
});

export const updateSupportTicketStatusController = asyncHandler(async (req: Request, res: Response) => {
  const { ticketId } = req.params as { ticketId: string };
  const { reason } = req.body as { reason: string };
  const result = await updateSupportTicketStatusForAdmin({
    ticketId,
    ...(req.body as Omit<Parameters<typeof updateSupportTicketStatusForAdmin>[0], 'ticketId' | 'audit'>),
    audit: auditContext(req, reason),
  });

  return sendSuccessResponse({
    res,
    message: 'Support ticket status updated successfully',
    data: result,
  });
});

export const updateSupportTicketPriorityController = asyncHandler(async (req: Request, res: Response) => {
  const { ticketId } = req.params as { ticketId: string };
  const { reason } = req.body as { reason: string };
  const result = await updateSupportTicketPriorityForAdmin({
    ticketId,
    ...(req.body as Omit<Parameters<typeof updateSupportTicketPriorityForAdmin>[0], 'ticketId' | 'audit'>),
    audit: auditContext(req, reason),
  });

  return sendSuccessResponse({
    res,
    message: 'Support ticket priority updated successfully',
    data: result,
  });
});

export const updateSupportTicketAssignmentController = asyncHandler(async (req: Request, res: Response) => {
  const { ticketId } = req.params as { ticketId: string };
  const { reason } = req.body as { reason: string };
  const result = await updateSupportTicketAssignmentForAdmin({
    ticketId,
    ...(req.body as Omit<Parameters<typeof updateSupportTicketAssignmentForAdmin>[0], 'ticketId' | 'audit'>),
    audit: auditContext(req, reason),
  });

  return sendSuccessResponse({
    res,
    message: 'Support ticket assignment updated successfully',
    data: result,
  });
});

export const listSupportTicketNotesController = asyncHandler(async (req: Request, res: Response) => {
  const { ticketId } = req.params as { ticketId: string };
  const result = await listSupportTicketNotesForAdmin(ticketId);

  return sendSuccessResponse({
    res,
    message: 'Support ticket notes fetched successfully',
    data: result,
  });
});

export const createSupportTicketNoteController = asyncHandler(async (req: Request, res: Response) => {
  const { ticketId } = req.params as { ticketId: string };
  const result = await createSupportTicketNoteForAdmin({
    ticketId,
    ...(req.body as Omit<Parameters<typeof createSupportTicketNoteForAdmin>[0], 'ticketId' | 'adminId' | 'audit'>),
    adminId: req.user?.userId ?? null,
    audit: auditContext(req, 'Support ticket note created'),
  });

  return sendCreatedResponse({
    res,
    message: 'Support ticket note created successfully',
    data: result,
  });
});

export const listSupportTicketAuditController = asyncHandler(async (req: Request, res: Response) => {
  const { ticketId } = req.params as { ticketId: string };
  const result = await listSupportTicketAuditForAdmin(ticketId);

  return sendSuccessResponse({
    res,
    message: 'Support ticket audit fetched successfully',
    data: result,
  });
});
