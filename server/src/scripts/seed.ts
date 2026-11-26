import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import { connectDb, disconnectDb } from '../db.js';
import { BODY_TYPES, Car, FUELS, TAGS, TRANSMISSIONS } from '../modules/cars/car.model.js';
import { Offer } from '../modules/offers/offer.model.js';
import { User } from '../modules/users/user.model.js';

const PASSWORD = 'password123';

const USERS = [
  { name: 'Minh Tran', email: 'minh@example.com', location: { city: 'Austin', state: 'TX' } },
  { name: 'Sarah Le', email: 'sarah@example.com', location: { city: 'Dallas', state: 'TX' } },
  { name: 'David Nguyen', email: 'david@example.com', location: { city: 'Houston', state: 'TX' } },
  { name: 'Anna Pham', email: 'anna@example.com', location: { city: 'San Jose', state: 'CA' } },
  { name: 'Kevin Hoang', email: 'kevin@example.com', location: { city: 'Seattle', state: 'WA' } },
];

// The five hero cars shown on the landing page, one per seller.
const HERO_CARS = [
  { make: 'Toyota', model: 'Camry SE', year: 2020, mileageKm: 42000, fuel: 'petrol', transmission: 'automatic', bodyType: 'sedan', price: 18500, tag: 'offers_welcome' },
  { make: 'Honda', model: 'Civic RS', year: 2021, mileageKm: 31500, fuel: 'petrol', transmission: 'cvt', bodyType: 'sedan', price: 21200, tag: 'verified' },
  { make: 'Mazda', model: '6 Signature', year: 2022, mileageKm: 19000, fuel: 'petrol', transmission: 'automatic', bodyType: 'sedan', price: 24800, tag: 'hot_deal' },
  { make: 'Hyundai', model: 'Tucson Hybrid', year: 2022, mileageKm: 25400, fuel: 'hybrid', transmission: 'automatic', bodyType: 'suv', price: 29500, tag: 'offers_welcome' },
  { make: 'Kia', model: 'K5 GT-Line', year: 2021, mileageKm: 38000, fuel: 'petrol', transmission: 'automatic', bodyType: 'sedan', price: 23900, tag: 'price_drop' },
] as const;

const EXTRA_MODELS: { make: string; model: string; bodyType: (typeof BODY_TYPES)[number] }[] = [
  { make: 'Toyota', model: 'RAV4', bodyType: 'suv' },
  { make: 'Toyota', model: 'Tacoma', bodyType: 'pickup' },
  { make: 'Honda', model: 'CR-V', bodyType: 'suv' },
  { make: 'Honda', model: 'Fit', bodyType: 'hatchback' },
  { make: 'Ford', model: 'F-150', bodyType: 'pickup' },
  { make: 'Ford', model: 'Mustang', bodyType: 'coupe' },
  { make: 'Tesla', model: 'Model 3', bodyType: 'sedan' },
  { make: 'Tesla', model: 'Model Y', bodyType: 'suv' },
  { make: 'Volkswagen', model: 'Golf', bodyType: 'hatchback' },
  { make: 'Chrysler', model: 'Pacifica', bodyType: 'van' },
  { make: 'BMW', model: '330i', bodyType: 'sedan' },
  { make: 'Subaru', model: 'BRZ', bodyType: 'coupe' },
  { make: 'Kia', model: 'Carnival', bodyType: 'van' },
];

async function main() {
  if (env.NODE_ENV === 'production') {
    console.error('Refusing to seed in production.');
    process.exit(1);
  }

  await connectDb(env.MONGO_URI);
  await Promise.all([User.deleteMany({}), Car.deleteMany({}), Offer.deleteMany({})]);

  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const users = await User.insertMany(USERS.map((u) => ({ ...u, passwordHash })));

  const now = Date.now();
  const cars = [];

  // Hero cars: newest listings.
  for (const [i, c] of HERO_CARS.entries()) {
    const seller = users[i];
    cars.push({
      ...c,
      title: `${c.make} ${c.model}`,
      seller: seller._id,
      location: seller.location,
      description: `Well kept ${c.make} ${c.model}, one owner.`,
      createdAt: new Date(now - i * 60_000),
    });
  }

  // 25 extra cars covering every body type / fuel / transmission.
  for (let i = 0; i < 25; i++) {
    const m = EXTRA_MODELS[i % EXTRA_MODELS.length];
    const seller = users[i % users.length];
    const fuel = m.make === 'Tesla' ? 'electric' : FUELS[i % 3]; // petrol/diesel/hybrid
    cars.push({
      make: m.make,
      model: m.model,
      title: `${m.make} ${m.model}`,
      year: 2015 + (i % 10),
      mileageKm: 8000 + ((i * 7919) % 120000),
      fuel,
      transmission: TRANSMISSIONS[i % TRANSMISSIONS.length],
      bodyType: m.bodyType,
      price: 9000 + ((i * 3779) % 40000),
      tag: i % 4 === 0 ? undefined : TAGS[i % TAGS.length],
      seller: seller._id,
      location: seller.location,
      description: '',
      // A few are already sold so "My Cars" has some variety.
      ...(i % 9 === 8 && { status: 'sold', buyer: users[(i + 1) % users.length]._id }),
      createdAt: new Date(now - (i + 10) * 3_600_000),
    });
  }

  const inserted = await Car.insertMany(cars);
  for (const c of inserted) {
    if (c.status === 'sold') await Car.updateOne({ _id: c._id }, { soldPrice: c.price });
  }

  // Sample offers on the hero cars.
  const [camry, civic, mazda] = inserted;
  await Offer.insertMany([
    { car: camry._id, seller: camry.seller, buyer: users[1]._id, amount: 17500, message: 'Can pick it up this weekend.' },
    { car: camry._id, seller: camry.seller, buyer: users[2]._id, amount: 17000 },
    { car: civic._id, seller: civic.seller, buyer: users[0]._id, amount: 20000, status: 'rejected' },
    { car: mazda._id, seller: mazda.seller, buyer: users[3]._id, amount: 23500, status: 'withdrawn' },
  ]);

  const active = inserted.filter((c) => c.status === 'active').length;
  console.log(`Seeded ${users.length} users, ${inserted.length} cars (${active} active), 4 offers.`);
  console.log(`Log in with any of: ${USERS.map((u) => u.email).join(', ')}  /  password: ${PASSWORD}`);
  await disconnectDb();
}

main().catch(async (err) => {
  console.error(err);
  await disconnectDb();
  process.exit(1);
});
