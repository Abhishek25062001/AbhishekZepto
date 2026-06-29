const FORBIDDEN_AUDIT_FIELDS = [
  'authorization',
  'token',
  'accessToken',
  'refreshToken',
  'gatewaySignature',
  'webhookSecret',
  'rawWebhookPayload',
  'bankAccount',
  'upiId',
  'cardNumber',
  'cvv',
  'secret',
] as const;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const sanitizeLedgerAuditMetadata = (
  metadata: Record<string, unknown> | null | undefined,
): Record<string, unknown> => {
  if (!metadata) {
    return {};
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (FORBIDDEN_AUDIT_FIELDS.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      continue;
    }

    if (isPlainObject(value)) {
      sanitized[key] = sanitizeLedgerAuditMetadata(value);
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
};
