import app from './app';
import { logger } from './utils/logger';
import { prisma } from './config/db';
import { ensureDemoData } from './data/demoSeed';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await ensureDemoData(prisma);
  } catch (error) {
    logger.error('Demo data bootstrap failed:', error);
  }

  const server = app.listen(PORT, () => {
    logger.info(`✅ Server running on http://localhost:${PORT}`);
    logger.info(`📊 Health check: http://localhost:${PORT}/health`);
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
