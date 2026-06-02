import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

import {
  auditLogIdParamValidator,
  listAuditLogsQueryValidator,
} from '../validators/audit-log-system.validator';

const collectSources = (dir: string): string[] => {
  const candidates = [
    resolve(process.cwd(), dir),
    resolve(process.cwd(), 'backend/api', dir),
  ];
  const root = candidates.find((candidate) => existsSync(candidate));

  assert.ok(root, `Expected source directory to exist for ${dir}`);

  return readdirSync(root).flatMap((entry) => {
    const fullPath = resolve(root, entry);
    if (statSync(fullPath).isDirectory()) {
      return collectSources(resolve(dir, entry));
    }

    return fullPath.endsWith('.ts') && !fullPath.endsWith('.test.ts')
      ? [readFileSync(fullPath, 'utf8')]
      : [];
  });
};

test('audit log system repository stays read-only and scoped to admin action audits', () => {
  const repositorySource = readFileSync(
    resolve(process.cwd(), 'src/modules/audit-log-system/repositories/audit-log-system.repository.ts'),
    'utf8',
  );
  const serviceSource = readFileSync(
    resolve(process.cwd(), 'src/modules/audit-log-system/services/audit-log-system.service.ts'),
    'utf8',
  );
  const validatorSource = readFileSync(
    resolve(process.cwd(), 'src/modules/audit-log-system/validators/audit-log-system.validator.ts'),
    'utf8',
  );

  assert.match(repositorySource, /AdminActionAuditModel\.find\(filter\)/);
  assert.match(repositorySource, /AdminActionAuditModel\.findById\(auditLogId\)/);
  assert.match(repositorySource, /AdminActionAuditModel\.countDocuments\(filter\)/);
  assert.match(repositorySource, /sort\(\{ createdAt: -1 \}\)/);
  assert.doesNotMatch(repositorySource, /AdminActionAuditModel\.(create|findOneAndUpdate|updateOne|deleteOne|deleteMany|findByIdAndDelete)/);
  assert.match(serviceSource, /ERROR_CODES\.AUDIT_LOG_NOT_FOUND/);
  assert.match(validatorSource, /adminId:/);
  assert.match(validatorSource, /actionType:/);
  assert.match(validatorSource, /entityType:/);
  assert.match(validatorSource, /entityId:/);
  assert.match(validatorSource, /from:/);
  assert.match(validatorSource, /to:/);
});

test('audit log validators accept documented filters and reject invalid ids', () => {
  const parsed = listAuditLogsQueryValidator.query.parse({
    adminId: '64f0f0f0f0f0f0f0f0f0f0f0',
    actionType: 'FORCE_ORDER_CANCEL',
    entityType: 'order',
    entityId: '64f0f0f0f0f0f0f0f0f0f0f1',
    from: '2026-06-01T00:00:00.000Z',
    to: '2026-06-02T00:00:00.000Z',
    page: '2',
    limit: '25',
  });

  assert.equal(parsed.page, 2);
  assert.equal(parsed.limit, 25);
  assert.equal(parsed.from instanceof Date, true);
  assert.equal(parsed.to instanceof Date, true);
  assert.equal(
    auditLogIdParamValidator.params.parse({ auditLogId: '64f0f0f0f0f0f0f0f0f0f0f2' }).auditLogId,
    '64f0f0f0f0f0f0f0f0f0f0f2',
  );
  assert.throws(() => auditLogIdParamValidator.params.parse({ auditLogId: 'not-valid' }));
});

test('audit log system source excludes future workflows and write routes', () => {
  const source = collectSources('src/modules/audit-log-system').join('\n');

  assert.doesNotMatch(source, /router\.(post|patch|put|delete)/);
  assert.doesNotMatch(source, /AdminActionAuditModel\.(create|findOneAndUpdate|updateOne|deleteOne|deleteMany|findByIdAndDelete)/);
  assert.doesNotMatch(source, /analytics|replay|exportAudit|dataExport|refund|payout|commission|promotion|tax|orderStatus|deliveryStatus|customerStatus|supportTicket|catalog|vendor|storeOperationalStatus/i);
});
