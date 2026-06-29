export const LEDGER_ACCOUNT_CATEGORY = {
  CASH_BANK: 'cash_bank',
  PAYMENT_GATEWAY_RECEIVABLE: 'payment_gateway_receivable',
  VENDOR_PAYABLE: 'vendor_payable',
  DELIVERY_PARTNER_PAYABLE: 'delivery_partner_payable',
  PLATFORM_FEE_REVENUE: 'platform_fee_revenue',
  DELIVERY_FEE_REVENUE: 'delivery_fee_revenue',
  COMMISSION_REVENUE: 'commission_revenue',
  TAX_PAYABLE: 'tax_payable',
  REFUND_PAYABLE: 'refund_payable',
  DISCOUNT_EXPENSE: 'discount_expense',
  MANUAL_ADJUSTMENT: 'manual_adjustment',
  OTHER: 'other',
} as const;

export const LEDGER_ACCOUNT_CATEGORY_VALUES = Object.values(LEDGER_ACCOUNT_CATEGORY);

export type LedgerAccountCategory =
  (typeof LEDGER_ACCOUNT_CATEGORY)[keyof typeof LEDGER_ACCOUNT_CATEGORY];
