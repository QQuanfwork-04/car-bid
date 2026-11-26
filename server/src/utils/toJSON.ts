import type { ToObjectOptions } from 'mongoose';

/** Shared JSON transform: `_id` -> `id`, drop `__v` and `passwordHash`. */
export const toJSON: ToObjectOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
};
