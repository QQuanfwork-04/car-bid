import { z } from '../../docs/zod.js';
import { registry } from '../../docs/registry.js';

export const Location = registry.register(
  'Location',
  z.object({
    city: z.string().trim().min(1).max(80).openapi({ example: 'Austin' }),
    state: z.string().trim().min(1).max(80).openapi({ example: 'TX' }),
  }),
);

export const UserSchema = registry.register(
  'User',
  z.object({
    id: z.string(),
    email: z.email(),
    name: z.string(),
    location: Location.optional(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
);

export const RegisterBody = registry.register(
  'RegisterBody',
  z.object({
    email: z.email().max(254).openapi({ example: 'minh@example.com' }),
    // bcrypt only uses the first 72 bytes.
    password: z.string().min(8).max(72).openapi({ example: 'password123' }),
    name: z.string().trim().min(1).max(80).openapi({ example: 'Minh Tran' }),
    location: Location.optional(),
  }),
);
export type RegisterInput = z.infer<typeof RegisterBody>;

export const LoginBody = registry.register(
  'LoginBody',
  z.object({
    email: z.email().openapi({ example: 'minh@example.com' }),
    password: z.string().min(1).openapi({ example: 'password123' }),
  }),
);
export type LoginInput = z.infer<typeof LoginBody>;

export const AuthResponse = registry.register(
  'AuthResponse',
  z.object({ token: z.string(), user: UserSchema }),
);
