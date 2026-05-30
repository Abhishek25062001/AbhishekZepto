/* global console, process */
import { spawnSync } from 'node:child_process';

const [selector] = process.argv.slice(2);
const scriptBySelector = new Map([
  ['notification', 'test:notifications'],
  ['notifications', 'test:notifications'],
  ['realtime', 'test:realtime-operations'],
  ['push-notifications', 'test:push-notifications'],
]);
const script = scriptBySelector.get(selector);

if (!script) {
  console.error(`Unsupported delivery app test selector: ${selector ?? '(none)'}`);
  process.exit(1);
}

const result = spawnSync('npm', ['run', script], { stdio: 'inherit' });
process.exit(result.status ?? 1);
