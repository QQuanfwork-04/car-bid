import { Router } from 'express';
import { errors, json, paginated, registry, secured } from '../../docs/registry.js';
import { currentUserId, requireAuth } from '../../middleware/auth.js';
import { idParams, validate } from '../../middleware/validate.js';
import { CarSchema, CreateCarBody, ListCarsQuery, MyCarsQuery, UpdateCarBody } from './cars.schema.js';
import * as cars from './cars.service.js';

export const carsRouter = Router();

registry.registerPath({
  method: 'get',
  path: '/cars',
  tags: ['Cars'],
  summary: 'List active cars (paginated, filterable)',
  request: { query: ListCarsQuery },
  responses: { 200: json(paginated(CarSchema), 'A page of cars'), ...errors(400) },
});
carsRouter.get('/cars', validate({ query: ListCarsQuery }), async (_req, res) => {
  res.json(await cars.listCars(res.locals.query));
});

registry.registerPath({
  method: 'get',
  path: '/cars/{id}',
  tags: ['Cars'],
  summary: 'Get one car',
  request: { params: idParams },
  responses: { 200: json(CarSchema, 'The car'), ...errors(400, 404) },
});
carsRouter.get('/cars/:id', validate({ params: idParams }), async (_req, res) => {
  res.json(await cars.getCar(res.locals.params.id));
});

registry.registerPath({
  method: 'post',
  path: '/cars',
  tags: ['Cars'],
  summary: 'List a car for sale',
  security: secured,
  request: { body: { content: { 'application/json': { schema: CreateCarBody } } } },
  responses: { 201: json(CarSchema, 'Created'), ...errors(400, 401) },
});
carsRouter.post('/cars', requireAuth, validate({ body: CreateCarBody }), async (req, res) => {
  res.status(201).json(await cars.createCar(currentUserId(req), req.body));
});

registry.registerPath({
  method: 'patch',
  path: '/cars/{id}',
  tags: ['Cars'],
  summary: 'Edit your active listing',
  security: secured,
  request: { params: idParams, body: { content: { 'application/json': { schema: UpdateCarBody } } } },
  responses: { 200: json(CarSchema, 'Updated'), ...errors(400, 401, 403, 404, 409) },
});
carsRouter.patch(
  '/cars/:id',
  requireAuth,
  validate({ params: idParams, body: UpdateCarBody }),
  async (req, res) => {
    res.json(await cars.updateCar(currentUserId(req), res.locals.params.id, req.body));
  },
);

registry.registerPath({
  method: 'delete',
  path: '/cars/{id}',
  tags: ['Cars'],
  summary: 'Withdraw your listing (rejects pending offers)',
  security: secured,
  request: { params: idParams },
  responses: { 200: json(CarSchema, 'Withdrawn'), ...errors(400, 401, 403, 404, 409) },
});
carsRouter.delete('/cars/:id', requireAuth, validate({ params: idParams }), async (req, res) => {
  res.json(await cars.withdrawCar(currentUserId(req), res.locals.params.id));
});

registry.registerPath({
  method: 'get',
  path: '/me/cars',
  tags: ['Me'],
  summary: 'My listings (any status)',
  security: secured,
  request: { query: MyCarsQuery },
  responses: { 200: json(paginated(CarSchema), 'A page of my cars'), ...errors(400, 401) },
});
carsRouter.get('/me/cars', requireAuth, validate({ query: MyCarsQuery }), async (req, res) => {
  res.json(await cars.listMyCars(currentUserId(req), res.locals.query));
});
