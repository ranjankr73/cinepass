import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';

import { corsOrigins, env } from './config/env.js';
import healthRouter from './routes/health.routes.js';

const app = express();

app.disable('x-powered-by');

app.use(helmet());

app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : false,
  }),
);

app.use(express.json({ limit: '1mb' }));

app.use(express.urlencoded({ extended: false, limit: '10kb' }));

app.use(pinoHttp());

app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'nodejs-backend',
    status: 'ok',
  });
});

app.use('/health', healthRouter);

// IMPORTANT: Register application routes above this handler.

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
    },
  });
});

const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body contains invalid JSON',
      },
    });

    return;
  }

  if (env.NODE_ENV !== 'production') {
    console.error('Unhandled request error:', error);
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};

app.use(errorHandler);

export default app;
