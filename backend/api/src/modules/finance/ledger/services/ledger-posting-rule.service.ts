import { LEDGER_SYSTEM_ACCOUNT_CODE } from '../constants/ledger-system-account-codes.constant';
import type { LedgerPostingContext, LedgerPostingRuleLine } from '../types/ledger.types';
import { ledgerJournalNotBalancedError } from '../utils/ledger-error.mapper';

const buildBalancedLines = (lines: LedgerPostingRuleLine[]): LedgerPostingRuleLine[] => {
  const totalDebit = lines.reduce((sum, line) => sum + line.debitAmount, 0);
  const totalCredit = lines.reduce((sum, line) => sum + line.creditAmount, 0);

  if (totalDebit !== totalCredit) {
    throw ledgerJournalNotBalancedError();
  }

  return lines;
};

export const buildPaymentReceivedEntry = (
  context: LedgerPostingContext,
): LedgerPostingRuleLine[] => {
  const totalAmount = context.amountPaise;
  const platformFee = context.platformFeeAmount ?? 0;
  const deliveryFee = context.deliveryFeeAmount ?? 0;
  const taxAmount = context.taxAmount ?? 0;
  const discountAmount = context.discountAmount ?? 0;

  const allocatedCredits = platformFee + deliveryFee + taxAmount + discountAmount;
  const vendorAmount = Math.max(totalAmount - allocatedCredits, 0);

  const creditLines: LedgerPostingRuleLine[] = [];

  if (vendorAmount > 0) {
    creditLines.push({
      accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.VENDOR_PAYABLE,
      debitAmount: 0,
      creditAmount: vendorAmount,
      description: 'Vendor payable portion',
    });
  }

  if (platformFee > 0) {
    creditLines.push({
      accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.PLATFORM_FEE_REVENUE,
      debitAmount: 0,
      creditAmount: platformFee,
      description: 'Platform fee revenue',
    });
  }

  if (deliveryFee > 0) {
    creditLines.push({
      accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.DELIVERY_FEE_REVENUE,
      debitAmount: 0,
      creditAmount: deliveryFee,
      description: 'Delivery fee revenue',
    });
  }

  if (taxAmount > 0) {
    creditLines.push({
      accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.TAX_PAYABLE,
      debitAmount: 0,
      creditAmount: taxAmount,
      description: 'Tax payable',
    });
  }

  if (discountAmount > 0) {
    creditLines.push({
      accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.DISCOUNT_EXPENSE,
      debitAmount: 0,
      creditAmount: discountAmount,
      description: 'Discount expense',
    });
  }

  if (creditLines.length === 0) {
    creditLines.push({
      accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.VENDOR_PAYABLE,
      debitAmount: 0,
      creditAmount: totalAmount,
      description: 'Vendor payable placeholder',
    });
  }

  return buildBalancedLines([
    {
      accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.PAYMENT_GATEWAY_RECEIVABLE,
      debitAmount: totalAmount,
      creditAmount: 0,
      description: 'Payment received',
    },
    ...creditLines,
  ]);
};

export const buildRefundApprovedEntry = (): LedgerPostingRuleLine[] => {
  throw new Error('buildRefundApprovedEntry is not implemented in Module 3');
};

export const buildRefundProcessedEntry = (): LedgerPostingRuleLine[] => {
  throw new Error('buildRefundProcessedEntry is not implemented in Module 3');
};

export const buildDeliveryEarningAccruedEntry = (): LedgerPostingRuleLine[] => {
  throw new Error('buildDeliveryEarningAccruedEntry is not implemented in Module 3');
};

export const buildVendorSettlementApprovedEntry = (): LedgerPostingRuleLine[] => {
  throw new Error('buildVendorSettlementApprovedEntry is not implemented in Module 3');
};
