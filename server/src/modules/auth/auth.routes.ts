import { Router } from 'express';
import { errors, json, registry, secured } from '../../docs/registry.js';
import { currentUserId, requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { AuthResponse, LoginBody, RegisterBody, UserSchema } from './auth.schema.js';
import * as auth from './auth.service.js';

export const authRouter = Router();

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  summary: 'Create an account',
  request: { body: { content: { 'application/json': { schema: RegisterBody } } } },
  responses: { 201: json(AuthResponse, 'Account created'), ...errors(400, 409) },
});
authRouter.post('/auth/register', validate({ body: RegisterBody }), async (req, res) => {
  res.status(201).json(await auth.register(req.body));
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Log in and receive a JWT',
  request: { body: { content: { 'application/json': { schema: LoginBody } } } },
  responses: { 200: json(AuthResponse, 'Logged in'), ...errors(400, 401) },
});
authRouter.post('/auth/login', validate({ body: LoginBody }), async (req, res) => {
  res.json(await auth.login(req.body));
});

registry.registerPath({
  method: 'get',
  path: '/auth/me',
  tags: ['Auth'],
  summary: 'Current user',
  security: secured,
  responses: { 200: json(UserSchema, 'Current user'), ...errors(401) },
});
authRouter.get('/auth/me', requireAuth, async (req, res) => {
  res.json(await auth.getUser(currentUserId(req)));
});
