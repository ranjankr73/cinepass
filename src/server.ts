import { createServer } from 'node:http';

import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const server = createServer(app);

let isShuttingDown = false;

async function startServer(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error) => {
      server.off('listening', onListening);
      reject(error);
    };

    const onListening = () => {
      server.off('error', onError);
      resolve();
    };

    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(env.PORT, '0.0.0.0');
  });

  console.info(`Server listening on port ${env.PORT}`);
}

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}; shutting down gracefully`);

  const forceCloseTimer = setTimeout(() => {
    console.error('Graceful shutdown timed out; closing connections');
    server.closeAllConnections();
  }, 10_000);

  forceCloseTimer.unref();

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    await prisma.$disconnect();

    console.info('Shutdown completed');
    process.exitCode = 0;
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exitCode = 1;
  } finally {
    clearTimeout(forceCloseTimer);
  }
}

process.once('SIGINT', () => {
  void shutdown('SIGINT');
});

process.once('SIGTERM', () => {
  void shutdown('SIGTERM');
});

try {
  await startServer();
} catch (error) {
  console.error('Failed to start server:', error);
  await prisma.$disconnect().catch(() => {});
  process.exitCode = 1;
}
