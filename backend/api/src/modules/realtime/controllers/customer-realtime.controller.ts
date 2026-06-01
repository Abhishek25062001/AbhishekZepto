import type { Request, Response } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { findUnacknowledgedEvents, acknowledgeEvent } from '../repositories/realtime-event-log.repository';

export const getCustomerMissedEventsController = asyncHandler(
  async (req: Request, res: Response) => {
    const events = await findUnacknowledgedEvents(req.user!.userId, 'customer_app');

    const mappedEvents = events.map((event) => ({
      eventId: event.eventId,
      eventName: event.eventName,
      recipientUserId: event.recipientUserId.toString(),
      appSurface: event.appSurface,
      deliveryStatus: event.deliveryStatus,
      payload: event.payload,
      emittedAt: event.emittedAt.toISOString(),
      acknowledgedAt: event.acknowledgedAt ? event.acknowledgedAt.toISOString() : null,
      expiresAt: event.expiresAt.toISOString(),
    }));

    return sendSuccessResponse({
      res,
      message: 'Missed events fetched successfully',
      data: mappedEvents,
    });
  },
);

export const ackCustomerEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = req.params as { eventId: string };
    const event = await acknowledgeEvent(eventId, req.user!.userId);

    return sendSuccessResponse({
      res,
      message: 'Event acknowledged successfully',
      data: event
        ? {
            eventId: event.eventId,
            deliveryStatus: event.deliveryStatus,
            acknowledgedAt: event.acknowledgedAt ? event.acknowledgedAt.toISOString() : null,
          }
        : null,
    });
  },
);
