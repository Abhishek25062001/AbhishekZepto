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

if (!suite || suite === 'realtime-control-tower' || suite === 'control-tower' || suite === 'realtime') {
  runRealtimeControlTower();
} else if (suite === 'notifications' || suite === 'notification') {
  runNotifications();
} else {
  throw new Error(`Unknown admin-dashboard test suite: ${suite}`);
}
