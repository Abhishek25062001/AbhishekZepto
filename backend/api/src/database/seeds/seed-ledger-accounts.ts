import { LEDGER_ACCOUNT_CATEGORY } from '../../modules/finance/ledger/constants/ledger-account-category.constant';
import { LEDGER_ACCOUNT_STATUS } from '../../modules/finance/ledger/constants/ledger-account-status.constant';
import { LEDGER_ACCOUNT_TYPE } from '../../modules/finance/ledger/constants/ledger-account-type.constant';
import { LEDGER_SYSTEM_ACCOUNT_CODE } from '../../modules/finance/ledger/constants/ledger-system-account-codes.constant';
import { LedgerAccountModel } from '../../modules/finance/ledger/models/ledger-account.model';

type SystemLedgerAccountSeed = {
  accountCode: string;
  accountName: string;
  accountType: (typeof LEDGER_ACCOUNT_TYPE)[keyof typeof LEDGER_ACCOUNT_TYPE];
  accountCategory: (typeof LEDGER_ACCOUNT_CATEGORY)[keyof typeof LEDGER_ACCOUNT_CATEGORY];
};

const systemLedgerAccounts: SystemLedgerAccountSeed[] = [
  {
    accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.PAYMENT_GATEWAY_RECEIVABLE,
    accountName: 'Payment Gateway Receivable',
    accountType: LEDGER_ACCOUNT_TYPE.ASSET,
    accountCategory: LEDGER_ACCOUNT_CATEGORY.PAYMENT_GATEWAY_RECEIVABLE,
  },
  {
    accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.VENDOR_PAYABLE,
    accountName: 'Vendor Payable',
    accountType: LEDGER_ACCOUNT_TYPE.LIABILITY,
    accountCategory: LEDGER_ACCOUNT_CATEGORY.VENDOR_PAYABLE,
  },
  {
    accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.DELIVERY_PARTNER_PAYABLE,
    accountName: 'Delivery Partner Payable',
    accountType: LEDGER_ACCOUNT_TYPE.LIABILITY,
    accountCategory: LEDGER_ACCOUNT_CATEGORY.DELIVERY_PARTNER_PAYABLE,
  },
  {
    accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.PLATFORM_FEE_REVENUE,
    accountName: 'Platform Fee Revenue',
    accountType: LEDGER_ACCOUNT_TYPE.INCOME,
    accountCategory: LEDGER_ACCOUNT_CATEGORY.PLATFORM_FEE_REVENUE,
  },
  {
    accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.DELIVERY_FEE_REVENUE,
    accountName: 'Delivery Fee Revenue',
    accountType: LEDGER_ACCOUNT_TYPE.INCOME,
    accountCategory: LEDGER_ACCOUNT_CATEGORY.DELIVERY_FEE_REVENUE,
  },
  {
    accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.COMMISSION_REVENUE,
    accountName: 'Commission Revenue',
    accountType: LEDGER_ACCOUNT_TYPE.INCOME,
    accountCategory: LEDGER_ACCOUNT_CATEGORY.COMMISSION_REVENUE,
  },
  {
    accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.TAX_PAYABLE,
    accountName: 'Tax Payable',
    accountType: LEDGER_ACCOUNT_TYPE.LIABILITY,
    accountCategory: LEDGER_ACCOUNT_CATEGORY.TAX_PAYABLE,
  },
  {
    accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.REFUND_PAYABLE,
    accountName: 'Refund Payable',
    accountType: LEDGER_ACCOUNT_TYPE.LIABILITY,
    accountCategory: LEDGER_ACCOUNT_CATEGORY.REFUND_PAYABLE,
  },
  {
    accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.DISCOUNT_EXPENSE,
    accountName: 'Discount Expense',
    accountType: LEDGER_ACCOUNT_TYPE.EXPENSE,
    accountCategory: LEDGER_ACCOUNT_CATEGORY.DISCOUNT_EXPENSE,
  },
  {
    accountCode: LEDGER_SYSTEM_ACCOUNT_CODE.MANUAL_ADJUSTMENT,
    accountName: 'Manual Adjustment',
    accountType: LEDGER_ACCOUNT_TYPE.EQUITY,
    accountCategory: LEDGER_ACCOUNT_CATEGORY.MANUAL_ADJUSTMENT,
  },
];

export const seedLedgerAccounts = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log(
      `Dry run: ledger accounts seed skipped for ${systemLedgerAccounts
        .map((account) => account.accountCode)
        .join(', ')}`,
    );
    return;
  }

  for (const account of systemLedgerAccounts) {
    await LedgerAccountModel.updateOne(
      { accountCode: account.accountCode },
      {
        $setOnInsert: {
          accountCode: account.accountCode,
          accountName: account.accountName,
          accountType: account.accountType,
          accountCategory: account.accountCategory,
          currency: 'INR',
          description: null,
          isSystemAccount: true,
          isPostingAllowed: true,
          parentAccountId: null,
          status: LEDGER_ACCOUNT_STATUS.ACTIVE,
          createdBy: null,
          updatedBy: null,
          isDeleted: false,
          deletedAt: null,
        },
      },
      { upsert: true },
    );
  }

  console.log('System ledger accounts seeded');
};
