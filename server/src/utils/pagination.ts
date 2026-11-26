import type { Model, PopulateOptions, QueryFilter, SortOrder } from 'mongoose';
import { z } from '../docs/zod.js';

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
  limit: z.coerce.number().int().min(1).max(50).default(12).openapi({ example: 12 }),
});

export type PageOptions = {
  page: number;
  limit: number;
  sort: Record<string, SortOrder | { $meta: 'textScore' }>;
  populate?: PopulateOptions | PopulateOptions[];
};

export async function paginate<T>(model: Model<T>, filter: QueryFilter<T>, opts: PageOptions) {
  const { page, limit, sort, populate } = opts;
  let query = model
    .find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
  if (populate) query = query.populate(populate);

  const [data, total] = await Promise.all([query, model.countDocuments(filter)]);
  return {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
