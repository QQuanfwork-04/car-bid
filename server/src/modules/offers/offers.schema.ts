import { registry } from '../../docs/registry.js';
import { z } from '../../docs/zod.js';
import { paginationQuery } from '../../utils/pagination.js';
import { OFFER_STATUSES } from './offer.model.js';

export const OfferSchema = registry.register(
  'Offer',
  z.object({
    id: z.string(),
    car: z.union([z.string(), z.object({ id: z.string(), title: z.string(), price: z.number().int() }).loose()]),
    buyer: z.union([z.string(), z.object({ id: z.string(), name: z.string() })]),
    seller: z.string(),
    amount: z.number().int().openapi({ example: 17500 }),
    message: z.string(),
    status: z.enum(OFFER_STATUSES),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
);

export const CreateOfferBody = registry.register(
  'CreateOfferBody',
  z.strictObject({
    amount: z.number().int().min(1).openapi({ example: 17500, description: 'USD, must be below the listed price' }),
    message: z.string().trim().max(500).default('').openapi({ example: 'Can pick it up this weekend.' }),
  }),
);
export type CreateOfferInput = z.infer<typeof CreateOfferBody>;

export const CarOffersQuery = paginationQuery.extend({
  status: z.enum(OFFER_STATUSES).optional(),
});
export type CarOffersInput = z.infer<typeof CarOffersQuery>;

export const MyOffersQuery = CarOffersQuery.extend({
  role: z.enum(['buyer', 'seller']).default('buyer').openapi({
    description: 'buyer = offers I made, seller = offers on my cars',
  }),
});
export type MyOffersInput = z.infer<typeof MyOffersQuery>;
