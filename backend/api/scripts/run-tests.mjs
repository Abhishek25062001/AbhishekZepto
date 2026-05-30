/* global console, process */
import { spawnSync } from 'node:child_process';

const [selector] = process.argv.slice(2);

const scriptBySelector = new Map([
  ['integration', 'test:phase-7'],
  ['phase-7', 'test:phase-7'],
  ['push-notifications', 'test:push-notifications'],
  ['realtime', 'test:realtime'],
  ['in-app-notifications', 'test:in-app-notifications'],
]);

const script = scriptBySelector.get(selector);

if (!script) {
  console.error(`Unsupported backend test selector: ${selector ?? '(none)'}`);
  process.exit(1);
}

const result = spawnSync('npm', ['run', script], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
