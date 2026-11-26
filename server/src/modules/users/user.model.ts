import { Schema, model, type InferSchemaType } from 'mongoose';
import { toJSON } from '../../utils/toJSON.js';

export const locationSchema = new Schema(
  {
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    location: { type: locationSchema, required: false },
  },
  { timestamps: true, toJSON },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User = model('User', userSchema);
