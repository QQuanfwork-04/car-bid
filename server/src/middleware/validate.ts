import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { z } from '../docs/zod.js';
import { AppError } from './error.js';

type Schemas = { body?: ZodType; query?: ZodType; params?: ZodType };

function parse<T>(schema: ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Invalid request',
      result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    );
  }
  return result.data;
}

/**
 * Validates and coerces request parts. Parsed values are stored on
 * `req.body` and on `res.locals.query` / `res.locals.params`
 * (Express 5 makes `req.query` read-only).
 */
export function validate(schemas: Schemas): RequestHandler {
  return (req, res, next) => {
    if (schemas.params) res.locals.params = parse(schemas.params, req.params);
    if (schemas.query) res.locals.query = parse(schemas.query, req.query);
    if (schemas.body) req.body = parse(schemas.body, req.body ?? {});
    next();
  };
}

export const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid id')
  .openapi({ example: '665f1c2b9a1e4b0012345678' });

export const idParams = z.object({ id: objectId });
