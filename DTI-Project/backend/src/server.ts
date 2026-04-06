import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { logger } from './utils/logger';
import { prisma } from './config/db';
import { ensureDemoData } from './data/demoSeed';
import { appRouter } from './trpc/router';
import { createTRPCContext } from './trpc/trpc';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await ensureDemoData(prisma);
  } catch (error) {
    logger.error('Demo data bootstrap failed:', error);
  }

  const server = createHTTPServer({
    router: appRouter,
    createContext: createTRPCContext,
    basePath: '/trpc/',
  });

  server.listen(PORT, () => {
    logger.info(`✅ Server running on http://localhost:${PORT}`);
    logger.info(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
  });

  process.on('SIGINT', () => {
    logger.info('Shutting down gracefully...');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    logger.info('Server terminated');
    server.close(() => {
      process.exit(0);
    });
  });
}

void startServer();
