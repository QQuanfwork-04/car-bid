import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { buildOpenApiDocument } from './docs/openapi.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { carsRouter } from './modules/cars/cars.routes.js';
import { offersRouter } from './modules/offers/offers.routes.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', authRouter);
  app.use('/api', carsRouter);
  app.use('/api', offersRouter);

  if (env.ENABLE_DOCS) {
    const document = buildOpenApiDocument();
    app.get('/api/docs.json', (_req, res) => {
      res.json(document);
    });
    app.use(
      '/api/docs',
      // Swagger UI ships inline scripts; relax CSP only for the docs page.
      helmet({ contentSecurityPolicy: false }),
      swaggerUi.serve,
      swaggerUi.setup(document, {
        customSiteTitle: 'CarBid API',
        swaggerOptions: { persistAuthorization: true },
      }),
    );
  }

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
