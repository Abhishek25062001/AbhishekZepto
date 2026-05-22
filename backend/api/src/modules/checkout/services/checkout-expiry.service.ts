import { writeAuditLog } from '../../audit';
import { CHECKOUT_AUDIT_EVENTS } from '../constants/checkout-audit-events.constant';
import { CHECKOUT_SESSION_STATUS } from '../constants/checkout-session-status.constant';
import {
  findExpiredInitiatedSessions,
  updateCheckoutSessionById,
} from '../repositories/checkout-session.repository';
import { expireCheckoutSessionRecord } from '../utils/checkout-session-expiry.util';

export type ExpireDueCheckoutSessionsSummary = {
  processedCount: number;
  expiredCount: number;
  failedCount: number;
};

export const expireDueCheckoutSessions = async (
  actorUserId = 'system',
): Promise<ExpireDueCheckoutSessionsSummary> => {
  const sessions = await findExpiredInitiatedSessions();
  let expiredCount = 0;
  let failedCount = 0;

  for (const session of sessions) {
    try {
      await expireCheckoutSessionRecord(session, actorUserId);

      const updated = await updateCheckoutSessionById(
        session._id.toString(),
        session.customerId.toString(),
        {
          status: CHECKOUT_SESSION_STATUS.EXPIRED,
          failureReason: 'reservation_expired',
        },
      );

      if (updated) {
        expiredCount += 1;
        await writeAuditLog({
          eventType: CHECKOUT_AUDIT_EVENTS.EXPIRED,
          actorId: null,
          actorRole: null,
          actorSurface: 'backend',
          entityType: 'checkout_session',
          entityId: session._id,
          vendorId: null,
          storeId: session.storeId,
          cityId: null,
          requestId: null,
          traceId: null,
          ipAddress: null,
          userAgent: null,
          metadata: {
            checkoutSessionId: session._id.toString(),
            lockTokenCount: session.lockTokens.length,
          },
          status: 'success',
        });
      }
    } catch {
      failedCount += 1;
    }
  }

  return {
    processedCount: sessions.length,
    expiredCount,
    failedCount,
  };
};
