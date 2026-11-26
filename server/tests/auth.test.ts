import { describe, expect, it } from 'vitest';
import { api, bearer, createUser } from './helpers.js';

describe('core', () => {
  it('GET /api/health', async () => {
    const res = await api().get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('unknown route -> 404 NOT_FOUND', async () => {
    const res = await api().get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('malformed JSON -> 400', async () => {
    const res = await api().post('/api/auth/login').set('Content-Type', 'application/json').send('{bad');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('auth', () => {
  const body = { email: 'Minh@Example.com', password: 'password123', name: 'Minh Tran' };

  it('registers and returns token + user without password', async () => {
    const res = await api().post('/api/auth/register').send(body);
    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ email: 'minh@example.com', name: 'Minh Tran' });
    expect(res.body.user.id).toEqual(expect.any(String));
    expect(res.body.user).not.toHaveProperty('passwordHash');
    expect(res.body.user).not.toHaveProperty('_id');
  });

  it('rejects duplicate email (case-insensitive) with 409', async () => {
    await api().post('/api/auth/register').send(body);
    const res = await api().post('/api/auth/register').send({ ...body, email: 'minh@example.com' });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_TAKEN');
  });

  it('validates input', async () => {
    const res = await api().post('/api/auth/register').send({ email: 'not-an-email', password: 'short', name: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    const paths = res.body.error.details.map((d: { path: string }) => d.path);
    expect(paths).toEqual(expect.arrayContaining(['email', 'password', 'name']));
  });

  it('logs in with correct credentials', async () => {
    await api().post('/api/auth/register').send(body);
    const res = await api().post('/api/auth/login').send({ email: 'MINH@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('wrong password and unknown email give the same 401', async () => {
    await api().post('/api/auth/register').send(body);
    const wrong = await api().post('/api/auth/login').send({ email: body.email, password: 'nope-nope' });
    const unknown = await api().post('/api/auth/login').send({ email: 'x@example.com', password: 'password123' });
    for (const res of [wrong, unknown]) {
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    }
    expect(wrong.body.error.message).toBe(unknown.body.error.message);
  });

  it('GET /auth/me requires a valid token', async () => {
    const { user, token } = await createUser();
    const ok = await api().get('/api/auth/me').set(bearer(token));
    expect(ok.status).toBe(200);
    expect(ok.body.id).toBe(user.id);

    const missing = await api().get('/api/auth/me');
    expect(missing.status).toBe(401);
    expect(missing.body.error.code).toBe('UNAUTHORIZED');

    const bad = await api().get('/api/auth/me').set(bearer('garbage'));
    expect(bad.status).toBe(401);
  });
});
