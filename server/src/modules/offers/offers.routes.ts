import { Router } from 'express';
import { errors, json, paginated, registry, secured } from '../../docs/registry.js';
import { currentUserId, requireAuth } from '../../middleware/auth.js';
import { idParams, validate } from '../../middleware/validate.js';
import { CarSchema } from '../cars/cars.schema.js';
import { CarOffersQuery, CreateOfferBody, MyOffersQuery, OfferSchema } from './offers.schema.js';
import * as offers from './offers.service.js';

export const offersRouter = Router();
offersRouter.use(['/cars/:id/offers', '/cars/:id/buy', '/offers', '/me/offers'], requireAuth);

registry.registerPath({
  method: 'post',
  path: '/cars/{id}/offers',
  tags: ['Offers'],
  summary: 'Make an offer below the listed price',
  security: secured,
  request: { params: idParams, body: { content: { 'application/json': { schema: CreateOfferBody } } } },
  responses: { 201: json(OfferSchema, 'Offer created'), ...errors(400, 401, 403, 404, 409) },
});
offersRouter.post(
  '/cars/:id/offers',
  validate({ params: idParams, body: CreateOfferBody }),
  async (req, res) => {
    res.status(201).json(await offers.createOffer(currentUserId(req), res.locals.params.id, req.body));
  },
);

registry.registerPath({
  method: 'get',
  path: '/cars/{id}/offers',
  tags: ['Offers'],
  summary: 'Offers on my car (seller only)',
  security: secured,
  request: { params: idParams, query: CarOffersQuery },
  responses: { 200: json(paginated(OfferSchema), 'A page of offers'), ...errors(400, 401, 403, 404) },
});
offersRouter.get(
  '/cars/:id/offers',
  validate({ params: idParams, query: CarOffersQuery }),
  async (req, res) => {
    res.json(await offers.listCarOffers(currentUserId(req), res.locals.params.id, res.locals.query));
  },
);

registry.registerPath({
  method: 'post',
  path: '/cars/{id}/buy',
  tags: ['Offers'],
  summary: 'Buy now at the listed price',
  security: secured,
  request: { params: idParams },
  responses: { 200: json(CarSchema, 'Car is now sold to you'), ...errors(400, 401, 403, 404, 409) },
});
offersRouter.post('/cars/:id/buy', validate({ params: idParams }), async (req, res) => {
  res.json(await offers.buyNow(currentUserId(req), res.locals.params.id));
});

registry.registerPath({
  method: 'get',
  path: '/me/offers',
  tags: ['Me'],
  summary: 'Offers I made (role=buyer) or received (role=seller)',
  security: secured,
  request: { query: MyOffersQuery },
  responses: { 200: json(paginated(OfferSchema), 'A page of offers'), ...errors(400, 401) },
});
offersRouter.get('/me/offers', validate({ query: MyOffersQuery }), async (req, res) => {
  res.json(await offers.listMyOffers(currentUserId(req), res.locals.query));
});

const actions = [
  { action: 'accept', summary: 'Accept an offer (seller) — car becomes sold', fn: offers.acceptOffer },
  { action: 'reject', summary: 'Reject an offer (seller)', fn: offers.rejectOffer },
  { action: 'withdraw', summary: 'Withdraw my offer (buyer)', fn: offers.withdrawOffer },
] as const;

for (const { action, summary, fn } of actions) {
  registry.registerPath({
    method: 'post',
    path: `/offers/{id}/${action}`,
    tags: ['Offers'],
    summary,
    security: secured,
    request: { params: idParams },
    responses: { 200: json(OfferSchema, 'Updated offer'), ...errors(400, 401, 403, 404, 409) },
  });
  offersRouter.post(`/offers/:id/${action}`, validate({ params: idParams }), async (req, res) => {
    res.json(await fn(currentUserId(req), res.locals.params.id));
  });
}
