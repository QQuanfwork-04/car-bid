import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../modules/users/user.model.js';
import { AppError } from './error.js';

declare module 'express-serve-static-core' {
  interface Request {
    /** Set by `requireAuth`. */
    userId?: string;
  }
}

export function signToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
  });
}

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : undefined;
  if (!token) throw new AppError(401, 'UNAUTHORIZED', 'Missing bearer token');

  let sub: string | undefined;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
    sub = typeof payload === 'object' ? payload.sub : undefined;
  } catch {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired token');
  }
  if (!sub || !(await User.exists({ _id: sub }))) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired token');
  }

  req.userId = sub;
  next();
};

/** For handlers behind `requireAuth`. */
export function currentUserId(req: { userId?: string }): string {
  if (!req.userId) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
  return req.userId;
}
