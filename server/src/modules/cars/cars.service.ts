import type { QueryFilter } from 'mongoose';
import { AppError } from '../../middleware/error.js';
import { paginate, type PageOptions } from '../../utils/pagination.js';
import { rejectPendingOffers } from '../offers/offer.model.js';
import { Car, type CarDoc } from './car.model.js';
import type { CreateCarInput, ListCarsInput, MyCarsInput, UpdateCarInput } from './cars.schema.js';

const sellerSummary = { path: 'seller', select: 'name location' };

const SORT_MAP: Record<ListCarsInput['sort'], PageOptions['sort']> = {
  newest: { createdAt: -1, _id: -1 },
  price_asc: { price: 1, _id: 1 },
  price_desc: { price: -1, _id: -1 },
  year_desc: { year: -1, _id: -1 },
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function range(min?: number, max?: number) {
  if (min === undefined && max === undefined) return undefined;
  return { ...(min !== undefined && { $gte: min }), ...(max !== undefined && { $lte: max }) };
}

export async function listCars(input: ListCarsInput) {
  const filter: QueryFilter<CarDoc> = { status: 'active' };
  if (input.q) filter.$text = { $search: input.q };
  if (input.make) filter.make = { $regex: `^${escapeRegex(input.make)}$`, $options: 'i' };
  if (input.bodyType) filter.bodyType = input.bodyType;
  if (input.fuel) filter.fuel = input.fuel;
  if (input.transmission) filter.transmission = input.transmission;
  const price = range(input.minPrice, input.maxPrice);
  if (price) filter.price = price;
  const year = range(input.minYear, input.maxYear);
  if (year) filter.year = year;

  return paginate(Car, filter, {
    page: input.page,
    limit: input.limit,
    sort: SORT_MAP[input.sort],
    populate: sellerSummary,
  });
}

export async function getCar(id: string) {
  const car = await Car.findById(id).populate(sellerSummary);
  if (!car) throw new AppError(404, 'NOT_FOUND', 'Car not found');
  return car;
}

export async function createCar(sellerId: string, input: CreateCarInput) {
  return Car.create({ ...input, seller: sellerId });
}

/** Load a car the user owns; 404 if missing, 403 if not theirs. */
async function getOwnedCar(userId: string, carId: string) {
  const car = await Car.findById(carId);
  if (!car) throw new AppError(404, 'NOT_FOUND', 'Car not found');
  if (!car.seller.equals(userId)) throw new AppError(403, 'FORBIDDEN', 'You are not the seller of this car');
  return car;
}

export async function updateCar(userId: string, carId: string, input: UpdateCarInput) {
  await getOwnedCar(userId, carId);
  // Conditional update so a car sold in the meantime cannot be edited.
  const updated = await Car.findOneAndUpdate(
    { _id: carId, status: 'active' },
    { $set: input },
    { returnDocument: 'after', runValidators: true },
  );
  if (!updated) throw new AppError(409, 'CAR_NOT_AVAILABLE', 'Only active listings can be edited');
  return updated;
}

export async function withdrawCar(userId: string, carId: string) {
  await getOwnedCar(userId, carId);
  const updated = await Car.findOneAndUpdate(
    { _id: carId, status: 'active' },
    { $set: { status: 'withdrawn' } },
    { returnDocument: 'after' },
  );
  if (!updated) throw new AppError(409, 'CAR_NOT_AVAILABLE', 'Only active listings can be withdrawn');
  await rejectPendingOffers(carId);
  return updated;
}

export async function listMyCars(userId: string, input: MyCarsInput) {
  return paginate(
    Car,
    { seller: userId, ...(input.status && { status: input.status }) },
    { page: input.page, limit: input.limit, sort: { createdAt: -1, _id: -1 } },
  );
}
