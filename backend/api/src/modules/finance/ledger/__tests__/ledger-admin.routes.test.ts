import assert from 'node:assert/strict';
import { test } from 'node:test';
import ledgerAdminRoutes from '../routes/ledger-admin.routes';
import { listLedgerAccountsQueryValidator } from '../validators/ledger-account.validator';
import { ledgerJournalIdParamsValidator } from '../validators/ledger-journal.validator';

const listRoutes = (
  router: typeof ledgerAdminRoutes,
): Array<{ path: string; methods: string[] }> => {
  const stack = (
    router as unknown as {
      stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }>;
    }
  ).stack;

  const routeMap = new Map<string, Set<string>>();

  for (const layer of stack) {
    if (!layer.route) {
      continue;
    }

    const existing = routeMap.get(layer.route.path) ?? new Set<string>();
    for (const method of Object.keys(layer.route.methods)) {
      existing.add(method);
    }
    routeMap.set(layer.route.path, existing);
  }

  return [...routeMap.entries()].map(([path, methods]) => ({
    path,
    methods: [...methods].sort(),
  }));
};

test('ledger admin routes expose expected endpoints', () => {
  const routes = listRoutes(ledgerAdminRoutes);

  assert.deepEqual(routes, [
    { path: '/accounts', methods: ['get', 'post'] },
    { path: '/accounts/:accountId', methods: ['delete', 'get', 'patch'] },
    { path: '/accounts/:accountId/lines', methods: ['get'] },
    { path: '/journals', methods: ['get'] },
    { path: '/journals/:journalId', methods: ['get'] },
    { path: '/journals/:journalId/reverse', methods: ['post'] },
  ]);
});

test('ledgerJournalIdParamsValidator requires valid ObjectId', () => {
  assert.throws(() => ledgerJournalIdParamsValidator.parse({ journalId: 'invalid' }));
});

test('listLedgerAccountsQueryValidator coerces boolean filters', () => {
  const parsed = listLedgerAccountsQueryValidator.parse({ isSystemAccount: 'true' });
  assert.equal(parsed.isSystemAccount, true);
});
