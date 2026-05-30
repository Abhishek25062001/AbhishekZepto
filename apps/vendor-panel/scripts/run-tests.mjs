/* global console, process */
import { spawnSync } from 'node:child_process';

const target = process.argv[2];

const scriptsByTarget = {
  notification: 'test:notifications',
  notifications: 'test:notifications',
  realtime: 'test:realtime-store-operations',
  'realtime-store-operations': 'test:realtime-store-operations',
};

const script = scriptsByTarget[target];

if (!script) {
  console.error(`Unsupported vendor-panel test target: ${target ?? '(missing)'}`);
  process.exit(1);
}

const result = spawnSync('npm', ['run', script], {
  shell: false,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
