import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { ZodType } from 'zod';
import { z } from './zod.js';

export const registry = new OpenAPIRegistry();

export const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

/** Use as `security` on protected routes. */
export const secured = [{ [bearerAuth.name]: [] }];

export const ErrorResponse = registry.register(
  'ErrorResponse',
  z.object({
    error: z.object({
      code: z.string().openapi({ example: 'VALIDATION_ERROR' }),
      message: z.string(),
      details: z.unknown().optional(),
    }),
  }),
);

export const Pagination = registry.register(
  'Pagination',
  z.object({
    page: z.number().int().openapi({ example: 1 }),
    limit: z.number().int().openapi({ example: 12 }),
    total: z.number().int().openapi({ example: 128 }),
    totalPages: z.number().int().openapi({ example: 11 }),
  }),
);

export function paginated<T extends ZodType>(item: T) {
  return z.object({ data: z.array(item), pagination: Pagination });
}

export function json<T extends ZodType>(schema: T, description: string) {
  return { description, content: { 'application/json': { schema } } };
}

const errorDescriptions: Record<number, string> = {
  400: 'Validation error',
  401: 'Missing or invalid token / credentials',
  403: 'Not allowed',
  404: 'Not found',
  409: 'Conflict with current state',
};

/** Build `responses` entries for the given error statuses. */
export function errors(...statuses: number[]) {
  return Object.fromEntries(statuses.map((s) => [s, json(ErrorResponse, errorDescriptions[s] ?? 'Error')]));
}
