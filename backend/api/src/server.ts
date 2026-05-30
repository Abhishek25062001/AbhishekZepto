import { createServer, type Server as HttpServer } from 'node:http';
import app from './app';
import { connectMongoDB, disconnectMongoDB } from './config/database';
import { env } from './config/env';
import { ensureMediaUploadDirectory } from './bootstrap/media-upload-dir.bootstrap';
import {
  startCheckoutSessionExpiryJob,
  stopCheckoutSessionExpiryJob,
} from './jobs/checkout-session-expiry.job';
import {
  startInventoryLockExpiryJob,
  stopInventoryLockExpiryJob,
} from './jobs/inventory-lock-expiry.job';
import {
  closeSocketServer,
  initializeSocketServer,
} from './modules/realtime/services/socket-server.service';
import { registerInternalEventSubscribers } from './modules/internal-events/services/internal-event-registry.service';

const fallbackPort = 5000;

let server: HttpServer | undefined;

const closeHttpServer = async (): Promise<void> => {
  if (!server) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    server?.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
};

const gracefulShutdown = async (signal: NodeJS.Signals): Promise<void> => {
  console.log(`${signal} received. Shutting down backend API.`);

  try {
    stopCheckoutSessionExpiryJob();
    stopInventoryLockExpiryJob();
    await closeSocketServer();
    await closeHttpServer();
    await disconnectMongoDB();
    process.exit(0);
  } catch (error) {
    console.error('Graceful shutdown failed:', error);
    process.exit(1);
  }
};

export const startServer = async () => {
  const port = env.APP_PORT || fallbackPort;

  await connectMongoDB();
  await ensureMediaUploadDirectory();

  server = createServer(app);
  initializeSocketServer(server);
  registerInternalEventSubscribers();

  server.listen(port, () => {
    console.log(`Backend API server started on port ${port}`);
    startInventoryLockExpiryJob();
    startCheckoutSessionExpiryJob();
  });

  return server;
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception detected:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection detected:', reason);
  process.exit(1);
});

process.on('SIGINT', () => {
  void gracefulShutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void gracefulShutdown('SIGTERM');
});

void startServer();
