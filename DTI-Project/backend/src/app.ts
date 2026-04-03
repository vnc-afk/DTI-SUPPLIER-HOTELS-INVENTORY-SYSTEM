import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { logger } from './utils/logger';

dotenv.config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

app.use('/api', apiRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
