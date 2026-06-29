import { Types } from 'mongoose';
import { writeAuditLog } from '../../../audit';
import { findCheckoutSessionByIdForCustomer } from '../../../checkout/repositories/checkout-session.repository';
import { findPaymentById } from '../../../payment/repositories/payment.repository';
import { LEDGER_AUDIT_EVENTS } from '../constants/ledger-audit-events.constant';
import { LEDGER_POSTING_TYPE } from '../constants/ledger-posting-type.constant';
import { LEDGER_SOURCE_TYPE } from '../constants/ledger-source-type.constant';
import { LEDGER_JOURNAL_STATUS } from '../constants/ledger-journal-status.constant';
import { findLedgerAccountByCode } from '../repositories/ledger-account.repository';
import { findJournalByIdempotencyKey } from '../repositories/ledger-journal.repository';
import type { LedgerAuditContext, LedgerPostingContext, LedgerPostingResult } from '../types/ledger.types';
import { sanitizeLedgerAuditMetadata } from '../utils/ledger-audit-sanitizer.util';
import { createAndPostJournal } from './ledger-journal.service';
import { buildPaymentReceivedEntry } from './ledger-posting-rule.service';

const buildPaymentReceivedIdempotencyKey = (paymentId: string): string =>
  `payment:${paymentId}:payment_received`;

const resolvePostingContextFromPayment = async (
  paymentId: string,
): Promise<LedgerPostingContext | null> => {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    return null;
  }

  const session = await findCheckoutSessionByIdForCustomer(
    payment.checkoutSessionId.toString(),
    payment.customerId.toString(),
  );

  const summary = session?.summarySnapshot;

  return {
    paymentId,
    amountPaise: payment.payableAmount ?? payment.amount,
    currency: payment.currency,
    platformFeeAmount: 0,
    deliveryFeeAmount: summary?.deliveryFeeAmount ?? 0,
    taxAmount: summary?.taxAmount ?? 0,
    discountAmount: summary?.discountAmount ?? 0,
    vendorId: payment.vendorId?.toString() ?? null,
  };
};

const mapRuleLinesToJournalLines = async (
  ruleLines: ReturnType<typeof buildPaymentReceivedEntry>,
) => {
  const journalLines = [];

  for (const ruleLine of ruleLines) {
    const account = await findLedgerAccountByCode(ruleLine.accountCode);

    if (!account) {
      throw new Error(`System ledger account missing: ${ruleLine.accountCode}`);
    }

    journalLines.push({
      accountId: account._id.toString(),
      debitAmount: ruleLine.debitAmount,
      creditAmount: ruleLine.creditAmount,
      description: ruleLine.description ?? null,
    });
  }

  return journalLines;
};

const writePostingAudit = async (
  eventType: string,
  paymentId: string,
  actorId: string,
  metadata: Record<string, unknown>,
  status: 'success' | 'failed',
): Promise<void> => {
  await writeAuditLog({
    eventType,
    actorId: Types.ObjectId.isValid(actorId) ? new Types.ObjectId(actorId) : null,
    actorRole: null,
    actorSurface: 'backend',
    entityType: 'payment',
    entityId: Types.ObjectId.isValid(paymentId) ? new Types.ObjectId(paymentId) : null,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: sanitizeLedgerAuditMetadata(metadata),
    status,
  });
};

export const postPaymentReceived = async (input: {
  paymentId: string;
  actorId: string;
  audit?: LedgerAuditContext;
}): Promise<LedgerPostingResult> => {
  const idempotencyKey = buildPaymentReceivedIdempotencyKey(input.paymentId);
  const existing = await findJournalByIdempotencyKey(idempotencyKey);

  if (existing?.status === LEDGER_JOURNAL_STATUS.POSTED) {
    return {
      success: true,
      journalId: existing._id.toString(),
      journalCode: existing.journalCode,
      created: false,
    };
  }

  try {
    const context = await resolvePostingContextFromPayment(input.paymentId);

    if (!context) {
      return {
        success: false,
        journalId: null,
        journalCode: null,
        created: false,
        error: 'payment_not_found',
      };
    }

    const ruleLines = buildPaymentReceivedEntry(context);
    const lines = await mapRuleLinesToJournalLines(ruleLines);

    const journal = await createAndPostJournal(
      {
        sourceType: LEDGER_SOURCE_TYPE.PAYMENT,
        sourceId: input.paymentId,
        sourceCode: input.paymentId,
        postingType: LEDGER_POSTING_TYPE.PAYMENT_RECEIVED,
        idempotencyKey,
        currency: context.currency,
        description: 'Payment received posting',
        metadata: { paymentId: input.paymentId },
        lines,
      },
      input.actorId,
      input.audit,
    );

    await writePostingAudit(
      LEDGER_AUDIT_EVENTS.POSTING_RULE_APPLIED,
      input.paymentId,
      input.actorId,
      {
        paymentId: input.paymentId,
        journalId: journal.id,
        journalCode: journal.journalCode,
        postingType: LEDGER_POSTING_TYPE.PAYMENT_RECEIVED,
      },
      'success',
    );

    return {
      success: true,
      journalId: journal.id,
      journalCode: journal.journalCode,
      created: true,
    };
  } catch (error) {
    await writePostingAudit(
      LEDGER_AUDIT_EVENTS.POSTING_FAILED,
      input.paymentId,
      input.actorId,
      {
        paymentId: input.paymentId,
        postingType: LEDGER_POSTING_TYPE.PAYMENT_RECEIVED,
        error: error instanceof Error ? error.message : 'unknown_error',
      },
      'failed',
    );

    return {
      success: false,
      journalId: null,
      journalCode: null,
      created: false,
      error: error instanceof Error ? error.message : 'unknown_error',
    };
  }
};

export const postRefundProcessed = async (): Promise<LedgerPostingResult> => {
  throw new Error('postRefundProcessed is not implemented in Module 3');
};

export const postVendorSettlementApproved = async (): Promise<LedgerPostingResult> => {
  throw new Error('postVendorSettlementApproved is not implemented in Module 3');
};

export const postDeliveryEarningAccrued = async (): Promise<LedgerPostingResult> => {
  throw new Error('postDeliveryEarningAccrued is not implemented in Module 3');
};

export const buildPaymentReceivedIdempotencyKeyForTests = buildPaymentReceivedIdempotencyKey;
