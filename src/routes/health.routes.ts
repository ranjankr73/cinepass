import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const healthRouter = Router();

healthRouter.get('/live', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

healthRouter.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ok',
      checks: {
        database: 'ok',
      },
    });
  } catch {
    res.status(503).json({
      status: 'error',
      checks: {
        database: 'unavailable',
      },
    });
  }
});

export default healthRouter;
