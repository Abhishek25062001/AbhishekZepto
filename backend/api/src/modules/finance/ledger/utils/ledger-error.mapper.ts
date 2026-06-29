import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import {
  LEDGER_ERROR_CODES,
  type LedgerErrorCode,
} from '../constants/ledger-error-codes.constant';

const toErrorCode = (code: LedgerErrorCode): ErrorCode => ERROR_CODES[code];

export const ledgerAccountNotFoundError = (): AppError =>
  new AppError({
    message: 'Ledger account not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_ACCOUNT_NOT_FOUND),
  });

export const ledgerAccountCodeAlreadyExistsError = (): AppError =>
  new AppError({
    message: 'Ledger account code already exists',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_ACCOUNT_CODE_ALREADY_EXISTS),
  });

export const ledgerAccountArchivedError = (): AppError =>
  new AppError({
    message: 'Ledger account is archived',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_ACCOUNT_ARCHIVED),
  });

export const ledgerAccountPostingNotAllowedError = (): AppError =>
  new AppError({
    message: 'Posting is not allowed on this ledger account',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_ACCOUNT_POSTING_NOT_ALLOWED),
  });

export const ledgerAccountHasPostedLinesError = (): AppError =>
  new AppError({
    message: 'Ledger account has posted transaction lines',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_ACCOUNT_HAS_POSTED_LINES),
  });

export const ledgerSystemAccountImmutableError = (): AppError =>
  new AppError({
    message: 'System ledger account cannot be modified',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_SYSTEM_ACCOUNT_IMMUTABLE),
  });

export const ledgerJournalNotFoundError = (): AppError =>
  new AppError({
    message: 'Ledger journal not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_JOURNAL_NOT_FOUND),
  });

export const ledgerJournalNotBalancedError = (): AppError =>
  new AppError({
    message: 'Ledger journal is not balanced',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_JOURNAL_NOT_BALANCED),
  });

export const ledgerJournalAlreadyPostedError = (): AppError =>
  new AppError({
    message: 'Ledger journal is already posted',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_JOURNAL_ALREADY_POSTED),
  });

export const ledgerJournalCannotReverseError = (): AppError =>
  new AppError({
    message: 'Ledger journal cannot be reversed',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_JOURNAL_CANNOT_REVERSE),
  });

export const ledgerJournalAlreadyReversedError = (): AppError =>
  new AppError({
    message: 'Ledger journal is already reversed',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_JOURNAL_ALREADY_REVERSED),
  });

export const ledgerIdempotencyKeyAlreadyUsedError = (): AppError =>
  new AppError({
    message: 'Ledger idempotency key is already used by a draft journal',
    statusCode: HTTP_STATUS.CONFLICT,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_IDEMPOTENCY_KEY_ALREADY_USED),
  });

export const ledgerLineInvalidError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Ledger transaction line is invalid',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_LINE_INVALID),
    details: details ?? {},
  });

export const ledgerParentAccountInvalidError = (): AppError =>
  new AppError({
    message: 'Parent ledger account is invalid or inactive',
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_PARENT_ACCOUNT_INVALID),
  });

export const ledgerPostingFailedError = (details?: Record<string, unknown>): AppError =>
  new AppError({
    message: 'Ledger posting failed',
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode: toErrorCode(LEDGER_ERROR_CODES.LEDGER_POSTING_FAILED),
    details: details ?? {},
  });
