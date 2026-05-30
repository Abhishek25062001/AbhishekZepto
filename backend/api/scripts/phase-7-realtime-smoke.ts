/* global console, process, setTimeout, clearTimeout */
import { io, type Socket } from 'socket.io-client';

type SmokeNamespace = 'customer' | 'delivery' | 'vendor' | 'admin';

type SmokeSocketConfig = {
  namespace: SmokeNamespace;
  url: string;
  token: string;
};

type SmokeResult = {
  name: string;
  status: 'pass' | 'fail' | 'skipped';
  detail: string;
};

const requiredNamespaces: SmokeNamespace[] = ['customer', 'delivery', 'vendor', 'admin'];
const timeoutMs = Number(process.env.PHASE_7_SMOKE_TIMEOUT_MS ?? 5000);
const apiBaseUrl = process.env.PHASE_7_SMOKE_API_BASE_URL ?? 'http://localhost:5000/api/v1';
const socketBaseUrl = process.env.PHASE_7_SMOKE_SOCKET_BASE_URL ?? 'http://localhost:5000';

const tokenEnvName = (namespace: SmokeNamespace): string =>
  `PHASE_7_SMOKE_${namespace.toUpperCase()}_TOKEN`;

const buildSocketConfigs = (): SmokeSocketConfig[] =>
  requiredNamespaces.map((namespace) => ({
    namespace,
    url: `${socketBaseUrl}/${namespace}`,
    token: process.env[tokenEnvName(namespace)] ?? '',
  }));

const waitForSocketConnect = async (config: SmokeSocketConfig): Promise<SmokeResult> => {
  if (!config.token) {
    return {
      name: `${config.namespace} socket connect`,
      status: 'skipped',
      detail: `${tokenEnvName(config.namespace)} is not set`,
    };
  }

  return new Promise<SmokeResult>((resolve) => {
    const socket: Socket = io(config.url, {
      auth: { token: config.token },
      reconnection: false,
      transports: ['websocket', 'polling'],
    });

    const timer = setTimeout(() => {
      socket.disconnect();
      resolve({
        name: `${config.namespace} socket connect`,
        status: 'fail',
        detail: `Timed out after ${timeoutMs}ms`,
      });
    }, timeoutMs);

    socket.once('connect', () => {
      clearTimeout(timer);
      socket.disconnect();
      resolve({
        name: `${config.namespace} socket connect`,
        status: 'pass',
        detail: `Connected to ${config.url}`,
      });
    });

    socket.once('connect_error', (error) => {
      clearTimeout(timer);
      socket.disconnect();
      resolve({
        name: `${config.namespace} socket connect`,
        status: 'fail',
        detail: error.message,
      });
    });
  });
};

const verifyRestEndpoint = async (
  name: string,
  path: string,
  token: string,
): Promise<SmokeResult> => {
  if (!token) {
    return {
      name,
      status: 'skipped',
      detail: 'Token is not set',
    };
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return {
    name,
    status: response.ok ? 'pass' : 'fail',
    detail: `${response.status} ${response.statusText}`,
  };
};

const runSmoke = async (): Promise<SmokeResult[]> => {
  const socketResults = await Promise.all(buildSocketConfigs().map(waitForSocketConnect));
  const customerToken = process.env.PHASE_7_SMOKE_CUSTOMER_TOKEN ?? '';
  const adminToken = process.env.PHASE_7_SMOKE_ADMIN_TOKEN ?? '';

  const fallbackResults = await Promise.all([
    verifyRestEndpoint(
      'customer missed-event replay endpoint',
      '/customer/realtime/missed-events',
      customerToken,
    ),
    verifyRestEndpoint(
      'admin control tower snapshot endpoint',
      '/admin/control-tower/snapshot',
      adminToken,
    ),
    verifyRestEndpoint(
      'customer notification center endpoint',
      '/customer/me/notifications',
      customerToken,
    ),
  ]);

  return [...socketResults, ...fallbackResults];
};

const main = async (): Promise<void> => {
  const results = await runSmoke();
  const failed = results.filter((result) => result.status === 'fail');

  results.forEach((result) => {
    console.log(`[${result.status}] ${result.name}: ${result.detail}`);
  });

  if (failed.length > 0) {
    process.exitCode = 1;
  }
};

void main();
