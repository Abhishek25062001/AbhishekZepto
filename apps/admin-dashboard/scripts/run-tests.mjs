import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

/* global process */

const suite = process.argv[2];
const compiledOnly = process.argv.includes('--compiled-only');

const findTestFiles = (directory) => {
  if (!existsSync(directory)) {
    return [];
  }

  const entries = readdirSync(directory);
  return entries.flatMap((entry) => {
    const entryPath = join(directory, entry);
    const stats = statSync(entryPath);
    if (stats.isDirectory()) {
      return findTestFiles(entryPath);
    }

    return entry.endsWith('.test.js') ? [entryPath] : [];
  });
};

const runRealtimeControlTower = () => {
  const outDir = 'dist-realtime-control-tower-test';
  if (!compiledOnly) {
    rmSync(outDir, { force: true, recursive: true });
    execFileSync('tsc', ['-p', 'tsconfig.realtime-control-tower-test.json'], {
      stdio: 'inherit',
    });
  }

  const testFiles = [
    ...findTestFiles(join(outDir, 'modules', 'realtime-control-tower')),
    ...findTestFiles(join(outDir, 'tests', 'integration')),
  ];

  if (testFiles.length === 0) {
    throw new Error('No realtime control tower tests found.');
  }

  execFileSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
};

const runNotifications = () => {
  const outDir = 'dist-notifications-test';
  if (!compiledOnly) {
    rmSync(outDir, { force: true, recursive: true });
    execFileSync('tsc', ['-p', 'tsconfig.notifications-test.json'], {
      stdio: 'inherit',
    });
  }

  const testFiles = findTestFiles(
    join(outDir, 'apps', 'admin-dashboard', 'src', 'modules', 'notification-center'),
  );
  if (testFiles.length === 0) {
    throw new Error('No notification tests found.');
  }

  execFileSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
};

const runAdminUsers = () => {
  const outDir = 'dist-admin-users-test';
  if (!compiledOnly) {
    rmSync(outDir, { force: true, recursive: true });
    execFileSync('tsc', ['-p', 'tsconfig.admin-users-test.json'], {
      stdio: 'inherit',
    });
  }

  const testFiles = findTestFiles(join(outDir, 'modules', 'admin-users'));
  if (testFiles.length === 0) {
    throw new Error('No admin users tests found.');
  }

  execFileSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
};

const runDeliveryAgents = () => {
  const outDir = 'dist-delivery-agents-test';
  if (!compiledOnly) {
    rmSync(outDir, { force: true, recursive: true });
    execFileSync('tsc', ['-p', 'tsconfig.delivery-agents-test.json'], {
      stdio: 'inherit',
    });
  }

  const testFiles = findTestFiles(join(outDir, 'modules', 'delivery-agents'));
  if (testFiles.length === 0) {
    throw new Error('No delivery agents tests found.');
  }

  execFileSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
};

const runVendorStores = () => {
  const outDir = 'dist-vendor-stores-test';
  if (!compiledOnly) {
    rmSync(outDir, { force: true, recursive: true });
    execFileSync('tsc', ['-p', 'tsconfig.vendor-stores-test.json'], {
      stdio: 'inherit',
    });
  }

  const testFiles = findTestFiles(join(outDir, 'modules', 'vendor-stores'));
  if (testFiles.length === 0) {
    throw new Error('No vendor stores tests found.');
  }

  execFileSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
};

const runCatalogOversight = () => {
  const outDir = 'dist-catalog-oversight-test';
  if (!compiledOnly) {
    rmSync(outDir, { force: true, recursive: true });
    execFileSync('tsc', ['-p', 'tsconfig.catalog-oversight-test.json'], {
      stdio: 'inherit',
    });
  }

  const testFiles = findTestFiles(join(outDir, 'modules', 'catalog'));
  if (testFiles.length === 0) {
    throw new Error('No catalog oversight tests found.');
  }

  execFileSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
};

const runSupport = () => {
  const outDir = 'dist-support-test';
  if (!compiledOnly) {
    rmSync(outDir, { force: true, recursive: true });
    execFileSync('tsc', ['-p', 'tsconfig.support-test.json'], {
      stdio: 'inherit',
    });
  }

  const testFiles = findTestFiles(join(outDir, 'modules', 'support'));
  if (testFiles.length === 0) {
    throw new Error('No support tests found.');
  }

  execFileSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
};

const runPlatformSettings = () => {
  const outDir = 'dist-platform-settings-test';
  if (!compiledOnly) {
    rmSync(outDir, { force: true, recursive: true });
    execFileSync('tsc', ['-p', 'tsconfig.platform-settings-test.json'], {
      stdio: 'inherit',
    });
  }

  const testFiles = findTestFiles(join(outDir, 'modules', 'platform-settings'));
  if (testFiles.length === 0) {
    throw new Error('No platform settings tests found.');
  }

  execFileSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
};

const runAuditLogs = () => {
  const outDir = 'dist-audit-logs-test';
  if (!compiledOnly) {
    rmSync(outDir, { force: true, recursive: true });
    execFileSync('tsc', ['-p', 'tsconfig.audit-logs-test.json'], {
      stdio: 'inherit',
    });
  }

  const testFiles = findTestFiles(join(outDir, 'modules', 'audit-logs'));
  if (testFiles.length === 0) {
    throw new Error('No audit log tests found.');
  }

  execFileSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
};

const runOperationalOverview = () => {
  const outDir = 'dist-operational-overview-test';
  if (!compiledOnly) {
    rmSync(outDir, { force: true, recursive: true });
    execFileSync('tsc', ['-p', 'tsconfig.operational-overview-test.json'], {
      stdio: 'inherit',
    });
  }

  const testFiles = findTestFiles(join(outDir, 'modules', 'operational-overview'));
  if (testFiles.length === 0) {
    throw new Error('No operational overview tests found.');
  }

  execFileSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
};

const runDataExports = () => {
  const outDir = 'dist-data-exports-test';
  if (!compiledOnly) {
    rmSync(outDir, { force: true, recursive: true });
    execFileSync('tsc', ['-p', 'tsconfig.data-exports-test.json'], {
      stdio: 'inherit',
    });
  }

  const testFiles = findTestFiles(join(outDir, 'modules', 'data-exports'));
  if (testFiles.length === 0) {
    throw new Error('No data exports tests found.');
  }

  execFileSync('node', ['--test', ...testFiles], { stdio: 'inherit' });
};

if (!suite || suite === 'realtime-control-tower' || suite === 'control-tower' || suite === 'realtime') {
  runRealtimeControlTower();
} else if (suite === 'notifications' || suite === 'notification') {
  runNotifications();
} else if (suite === 'admin-users' || suite === 'admin-user') {
  runAdminUsers();
} else if (suite === 'delivery-agents' || suite === 'delivery-agent') {
  runDeliveryAgents();
} else if (suite === 'vendor-stores' || suite === 'vendor-store') {
  runVendorStores();
} else if (suite === 'catalog-oversight' || suite === 'catalog') {
  runCatalogOversight();
} else if (suite === 'support') {
  runSupport();
} else if (suite === 'platform-settings' || suite === 'platform-setting') {
  runPlatformSettings();
} else if (suite === 'audit-logs' || suite === 'audit-log') {
  runAuditLogs();
} else if (suite === 'operational-overview' || suite === 'operational-analytics') {
  runOperationalOverview();
} else if (suite === 'data-exports' || suite === 'data-export' || suite === 'exports') {
  runDataExports();
} else {
  throw new Error(`Unknown admin-dashboard test suite: ${suite}`);
}
