import app from './app';
import { connectMongoDB, disconnectMongoDB } from './config/database';
import { env } from './config/env';

const fallbackPort = 5000;

let server: ReturnType<typeof app.listen> | undefined;

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

  server = app.listen(port, () => {
    console.log(`Backend API server started on port ${port}`);
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
