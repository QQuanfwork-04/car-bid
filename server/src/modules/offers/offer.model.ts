import { Schema, Types, model, type InferSchemaType } from 'mongoose';
import { toJSON } from '../../utils/toJSON.js';

export const OFFER_STATUSES = ['pending', 'accepted', 'rejected', 'withdrawn'] as const;

const offerSchema = new Schema(
  {
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 1 },
    message: { type: String, default: '' },
    status: { type: String, enum: OFFER_STATUSES, default: 'pending', required: true },
  },
  { timestamps: true, toJSON },
);

// One pending offer per buyer per car. Enforced by MongoDB, so it also holds
// when two requests arrive at the same time.
offerSchema.index(
  { car: 1, buyer: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' }, name: 'one_pending_offer_per_buyer' },
);
offerSchema.index({ car: 1, status: 1, createdAt: -1 });
offerSchema.index({ seller: 1, status: 1, createdAt: -1 });
offerSchema.index({ buyer: 1, status: 1, createdAt: -1 });

export type OfferDoc = InferSchemaType<typeof offerSchema>;
export const Offer = model('Offer', offerSchema);

/** Reject every pending offer on a car (after it is sold or withdrawn). */
export async function rejectPendingOffers(carId: Types.ObjectId | string, exceptOfferId?: string) {
  await Offer.updateMany(
    { car: carId, status: 'pending', ...(exceptOfferId && { _id: { $ne: exceptOfferId } }) },
    { $set: { status: 'rejected' } },
  );
}
