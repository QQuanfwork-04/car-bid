import bcrypt from 'bcrypt';
import { signToken } from '../../middleware/auth.js';
import { AppError } from '../../middleware/error.js';
import { User } from '../users/user.model.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

const BCRYPT_COST = 10;
// Compared against when the email does not exist, so login takes the same
// time either way and does not reveal which emails are registered.
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', BCRYPT_COST);

function isDuplicateKey(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000;
}

export async function register(input: RegisterInput) {
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);
  try {
    const user = await User.create({
      email: input.email,
      passwordHash,
      name: input.name,
      location: input.location,
    });
    return { token: signToken(user.id), user };
  } catch (err) {
    if (isDuplicateKey(err)) throw new AppError(409, 'EMAIL_TAKEN', 'Email is already registered');
    throw err;
  }
}

export async function login(input: LoginInput) {
  const user = await User.findOne({ email: input.email.toLowerCase().trim() }).select('+passwordHash');
  const ok = await bcrypt.compare(input.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
  return { token: signToken(user.id), user };
}

export async function getUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');
  return user;
}
