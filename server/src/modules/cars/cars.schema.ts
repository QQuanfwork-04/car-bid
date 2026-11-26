import { registry } from '../../docs/registry.js';
import { z } from '../../docs/zod.js';
import { paginationQuery } from '../../utils/pagination.js';
import { Location } from '../auth/auth.schema.js';
import { BODY_TYPES, CAR_STATUSES, FUELS, TAGS, TRANSMISSIONS } from './car.model.js';

const maxYear = () => new Date().getFullYear() + 1;

export const SellerSummary = registry.register(
  'SellerSummary',
  z.object({ id: z.string(), name: z.string(), location: Location.optional() }),
);

export const CarSchema = registry.register(
  'Car',
  z.object({
    id: z.string(),
    seller: z.union([z.string(), SellerSummary]).openapi({
      description: 'Seller id, or seller summary on GET /cars and GET /cars/{id}',
    }),
    make: z.string().openapi({ example: 'Toyota' }),
    model: z.string().openapi({ example: 'Camry SE' }),
    title: z.string().openapi({ example: 'Toyota Camry SE' }),
    year: z.number().int().openapi({ example: 2020 }),
    mileageKm: z.number().int().openapi({ example: 42000 }),
    fuel: z.enum(FUELS),
    transmission: z.enum(TRANSMISSIONS),
    bodyType: z.enum(BODY_TYPES),
    price: z.number().int().openapi({ example: 18500, description: 'USD, whole dollars' }),
    tag: z.enum(TAGS).optional(),
    location: Location,
    images: z.array(z.url()),
    description: z.string(),
    status: z.enum(CAR_STATUSES),
    buyer: z.string().optional(),
    soldPrice: z.number().int().optional(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
);

const carFields = {
  make: z.string().trim().min(1).max(50).openapi({ example: 'Toyota' }),
  model: z.string().trim().min(1).max(80).openapi({ example: 'Camry SE' }),
  title: z.string().trim().min(1).max(120).openapi({ example: 'Toyota Camry SE' }),
  year: z
    .number()
    .int()
    .min(1950)
    .refine((y) => y <= maxYear(), { message: 'Year is in the future' })
    .openapi({ example: 2020 }),
  mileageKm: z.number().int().min(0).max(2_000_000).openapi({ example: 42000 }),
  fuel: z.enum(FUELS),
  transmission: z.enum(TRANSMISSIONS),
  bodyType: z.enum(BODY_TYPES),
  price: z.number().int().min(1).max(10_000_000).openapi({ example: 18500 }),
  tag: z.enum(TAGS).optional(),
  location: Location,
  images: z.array(z.url()).max(10).default([]),
  description: z.string().max(2000).default(''),
};

export const CreateCarBody = registry.register('CreateCarBody', z.strictObject(carFields));
export type CreateCarInput = z.infer<typeof CreateCarBody>;

// Same fields, all optional. strictObject rejects seller/status/buyer/soldPrice.
export const UpdateCarBody = registry.register(
  'UpdateCarBody',
  z
    .strictObject({
      ...carFields,
      images: carFields.images.removeDefault(),
      description: carFields.description.removeDefault(),
    })
    .partial()
    .refine((b) => Object.keys(b).length > 0, { message: 'Provide at least one field' }),
);
export type UpdateCarInput = z.infer<typeof UpdateCarBody>;

const optionalInt = z.coerce.number().int().min(0).optional();

export const SORTS = ['newest', 'price_asc', 'price_desc', 'year_desc'] as const;

export const ListCarsQuery = paginationQuery.extend({
  q: z.string().trim().min(1).max(100).optional().openapi({ description: 'Search make, model or title' }),
  make: z.string().trim().min(1).max(50).optional().openapi({ example: 'Toyota' }),
  bodyType: z.enum(BODY_TYPES).optional(),
  fuel: z.enum(FUELS).optional(),
  transmission: z.enum(TRANSMISSIONS).optional(),
  minPrice: optionalInt,
  maxPrice: optionalInt,
  minYear: optionalInt,
  maxYear: optionalInt,
  sort: z.enum(SORTS).default('newest'),
});
export type ListCarsInput = z.infer<typeof ListCarsQuery>;

export const MyCarsQuery = paginationQuery.extend({
  status: z.enum(CAR_STATUSES).optional(),
});
export type MyCarsInput = z.infer<typeof MyCarsQuery>;
