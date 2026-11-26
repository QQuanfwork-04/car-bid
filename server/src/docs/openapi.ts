import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry.js';

/** Must be called after all route modules have registered their paths. */
export function buildOpenApiDocument() {
  return new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'CarBid API',
      version: '0.1.0',
      description:
        'Buy a car at the listed price or make an offer the seller can accept.\n\n' +
        'Get a token from `POST /auth/login`, then click **Authorize** and paste it.',
    },
    servers: [{ url: '/api' }],
    tags: [
      { name: 'Auth', description: 'Sign up, log in, current user' },
      { name: 'Cars', description: 'Browse and manage listings' },
      { name: 'Offers', description: 'Make, accept, reject offers; buy now' },
      { name: 'Me', description: "Current user's cars and offers" },
    ],
  });
}
