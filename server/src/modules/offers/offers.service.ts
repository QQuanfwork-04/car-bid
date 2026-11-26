import { AppError } from '../../middleware/error.js';
import { paginate } from '../../utils/pagination.js';
import { Car } from '../cars/car.model.js';
import { Offer, rejectPendingOffers } from './offer.model.js';
import type { CarOffersInput, CreateOfferInput, MyOffersInput } from './offers.schema.js';

const notAvailable = () => new AppError(409, 'CAR_NOT_AVAILABLE', 'This car is no longer available');

async function getActiveCar(carId: string) {
  const car = await Car.findById(carId);
  if (!car) throw new AppError(404, 'NOT_FOUND', 'Car not found');
  if (car.status !== 'active') throw notAvailable();
  return car;
}

/**
 * Atomically mark an active car as sold. Only one caller can win:
 * the filter `status: 'active'` stops every later request.
 */
async function markSold(carId: string, buyerId: string, price: number) {
  const car = await Car.findOneAndUpdate(
    { _id: carId, status: 'active' },
    { $set: { status: 'sold', buyer: buyerId, soldPrice: price } },
    { returnDocument: 'after' },
  );
  if (!car) throw notAvailable();
  return car;
}

export async function createOffer(buyerId: string, carId: string, input: CreateOfferInput) {
  const car = await getActiveCar(carId);
  if (car.seller.equals(buyerId)) throw new AppError(403, 'FORBIDDEN', 'You cannot make an offer on your own car');
  if (input.amount >= car.price) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Offer must be below the listed price; use buy now instead', [
      { path: 'amount', message: `Must be less than ${car.price}` },
    ]);
  }

  try {
    return await Offer.create({
      car: car._id,
      buyer: buyerId,
      seller: car.seller,
      amount: input.amount,
      message: input.message,
    });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      throw new AppError(409, 'OFFER_EXISTS', 'You already have a pending offer on this car');
    }
    throw err;
  }
}

export async function listCarOffers(userId: string, carId: string, input: CarOffersInput) {
  const car = await Car.findById(carId);
  if (!car) throw new AppError(404, 'NOT_FOUND', 'Car not found');
  if (!car.seller.equals(userId)) throw new AppError(403, 'FORBIDDEN', 'Only the seller can see offers on this car');

  return paginate(
    Offer,
    { car: car._id, ...(input.status && { status: input.status }) },
    {
      page: input.page,
      limit: input.limit,
      sort: { createdAt: -1, _id: -1 },
      populate: { path: 'buyer', select: 'name' },
    },
  );
}

export async function listMyOffers(userId: string, input: MyOffersInput) {
  return paginate(
    Offer,
    { [input.role]: userId, ...(input.status && { status: input.status }) },
    {
      page: input.page,
      limit: input.limit,
      sort: { createdAt: -1, _id: -1 },
      populate: [
        { path: 'car', select: 'title make model year price status images' },
        { path: 'buyer', select: 'name' },
      ],
    },
  );
}

async function getPendingOffer(offerId: string) {
  const offer = await Offer.findById(offerId);
  if (!offer) throw new AppError(404, 'NOT_FOUND', 'Offer not found');
  if (offer.status !== 'pending') throw new AppError(409, 'OFFER_NOT_PENDING', 'Offer is no longer pending');
  return offer;
}

/** Move a pending offer to a new status; 409 if it changed in the meantime. */
async function transitionOffer(offerId: string, status: 'accepted' | 'rejected' | 'withdrawn') {
  const updated = await Offer.findOneAndUpdate(
    { _id: offerId, status: 'pending' },
    { $set: { status } },
    { returnDocument: 'after' },
  );
  if (!updated) throw new AppError(409, 'OFFER_NOT_PENDING', 'Offer is no longer pending');
  return updated;
}

export async function acceptOffer(sellerId: string, offerId: string) {
  const offer = await getPendingOffer(offerId);
  if (!offer.seller.equals(sellerId)) throw new AppError(403, 'FORBIDDEN', 'Only the seller can accept this offer');

  // Claim the car first: if a buy-now or another accept won the race, stop here.
  await markSold(offer.car.toString(), offer.buyer.toString(), offer.amount);

  let accepted;
  try {
    accepted = await transitionOffer(offerId, 'accepted');
  } catch (err) {
    // The buyer withdrew between our check and the sale: put the car back on the market.
    await Car.updateOne(
      { _id: offer.car, status: 'sold', buyer: offer.buyer, soldPrice: offer.amount },
      { $set: { status: 'active' }, $unset: { buyer: 1, soldPrice: 1 } },
    );
    throw err;
  }
  await rejectPendingOffers(offer.car, offerId);
  return accepted;
}

export async function rejectOffer(sellerId: string, offerId: string) {
  const offer = await getPendingOffer(offerId);
  if (!offer.seller.equals(sellerId)) throw new AppError(403, 'FORBIDDEN', 'Only the seller can reject this offer');
  return transitionOffer(offerId, 'rejected');
}

export async function withdrawOffer(buyerId: string, offerId: string) {
  const offer = await getPendingOffer(offerId);
  if (!offer.buyer.equals(buyerId)) throw new AppError(403, 'FORBIDDEN', 'Only the buyer can withdraw this offer');
  return transitionOffer(offerId, 'withdrawn');
}

export async function buyNow(buyerId: string, carId: string) {
  const car = await getActiveCar(carId);
  if (car.seller.equals(buyerId)) throw new AppError(403, 'FORBIDDEN', 'You cannot buy your own car');

  const sold = await markSold(carId, buyerId, car.price);
  await rejectPendingOffers(car._id);
  return sold;
}
