import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sanitizeLedgerAuditMetadata } from '../utils/ledger-audit-sanitizer.util';

test('sanitizeLedgerAuditMetadata removes forbidden secret fields', () => {
  const sanitized = sanitizeLedgerAuditMetadata({
    paymentId: 'abc',
    gatewaySignature: 'secret-signature',
    authorization: 'Bearer token',
    nested: {
      webhookSecret: 'hidden',
      journalId: 'j1',
    },
  });

  assert.equal(sanitized.paymentId, 'abc');
  assert.equal(sanitized.gatewaySignature, undefined);
  assert.equal(sanitized.authorization, undefined);
  assert.deepEqual(sanitized.nested, { journalId: 'j1' });
});
