import { describe, expect, it } from 'vitest';
import { api } from './helpers.js';

const expected: Record<string, string[]> = {
  '/auth/register': ['post'],
  '/auth/login': ['post'],
  '/auth/me': ['get'],
  '/cars': ['get', 'post'],
  '/cars/{id}': ['get', 'patch', 'delete'],
  '/me/cars': ['get'],
  '/cars/{id}/offers': ['get', 'post'],
  '/cars/{id}/buy': ['post'],
  '/me/offers': ['get'],
  '/offers/{id}/accept': ['post'],
  '/offers/{id}/reject': ['post'],
  '/offers/{id}/withdraw': ['post'],
};

describe('swagger', () => {
  it('GET /api/docs.json documents every route', async () => {
    const res = await api().get('/api/docs.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.1.0');
    expect(res.body.components.securitySchemes.bearerAuth).toMatchObject({ type: 'http', scheme: 'bearer' });

    const paths = res.body.paths as Record<string, Record<string, { security?: unknown }>>;
    expect(Object.keys(paths).sort()).toEqual(Object.keys(expected).sort());
    for (const [path, methods] of Object.entries(expected)) {
      expect(Object.keys(paths[path]).sort()).toEqual([...methods].sort());
    }
    // protected routes advertise bearer auth
    expect(paths['/cars'].post.security).toEqual([{ bearerAuth: [] }]);
    expect(paths['/cars'].get.security).toBeUndefined();
  });

  it('GET /api/docs serves Swagger UI', async () => {
    const res = await api().get('/api/docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger-ui');
  });
});
