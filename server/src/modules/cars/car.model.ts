import { Schema, model, type InferSchemaType } from 'mongoose';
import { toJSON } from '../../utils/toJSON.js';
import { locationSchema } from '../users/user.model.js';

export const FUELS = ['petrol', 'diesel', 'hybrid', 'electric'] as const;
export const TRANSMISSIONS = ['automatic', 'manual', 'cvt'] as const;
export const BODY_TYPES = ['sedan', 'suv', 'hatchback', 'pickup', 'coupe', 'van'] as const;
export const TAGS = ['offers_welcome', 'verified', 'hot_deal', 'price_drop'] as const;
export const CAR_STATUSES = ['active', 'sold', 'withdrawn'] as const;

const carSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    mileageKm: { type: Number, required: true, min: 0 },
    fuel: { type: String, enum: FUELS, required: true },
    transmission: { type: String, enum: TRANSMISSIONS, required: true },
    bodyType: { type: String, enum: BODY_TYPES, required: true },
    price: { type: Number, required: true, min: 1 },
    tag: { type: String, enum: TAGS },
    location: { type: locationSchema, required: true },
    images: { type: [String], default: [] },
    description: { type: String, default: '' },
    status: { type: String, enum: CAR_STATUSES, default: 'active', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User' },
    soldPrice: { type: Number },
  },
  { timestamps: true, toJSON },
);

carSchema.index({ status: 1, createdAt: -1 });
carSchema.index({ status: 1, price: 1 });
carSchema.index({ status: 1, year: -1 });
carSchema.index({ make: 1 });
carSchema.index({ seller: 1, createdAt: -1 });
carSchema.index({ title: 'text', make: 'text', model: 'text' });

export type CarDoc = InferSchemaType<typeof carSchema>;
export const Car = model('Car', carSchema);
