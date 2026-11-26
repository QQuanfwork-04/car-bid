import { beforeEach, describe, expect, it } from 'vitest';
import { Car } from '../src/modules/cars/car.model.js';
import { api, bearer, createCar, createUser } from './helpers.js';

type Session = Awaited<ReturnType<typeof createUser>>;

let seller: Session;
let buyer: Session;
let buyer2: Session;
let car: { id: string; price: number };

beforeEach(async () => {
  seller = await createUser({ name: 'Seller' });
  buyer = await createUser({ name: 'Buyer' });
  buyer2 = await createUser({ name: 'Buyer Two' });
  car = await createCar(seller.token, { price: 20000 });
});

const offer = (s: Session, amount: number, carId = car.id) =>
  api().post(`/api/cars/${carId}/offers`).set(bearer(s.token)).send({ amount, message: 'hi' });

describe('create offer', () => {
  it('creates a pending offer', async () => {
    const res = await offer(buyer, 18000);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ amount: 18000, status: 'pending', buyer: buyer.user.id, seller: seller.user.id, car: car.id });
  });

  it('requires auth', async () => {
    const res = await api().post(`/api/cars/${car.id}/offers`).send({ amount: 1 });
    expect(res.status).toBe(401);
  });

  it('cannot offer on own car', async () => {
    const res = await offer(seller, 18000);
    expect(res.status).toBe(403);
  });

  it('amount must be below price', async () => {
    expect((await offer(buyer, 20000)).status).toBe(400);
    expect((await offer(buyer, 0)).status).toBe(400);
  });

  it('only one pending offer per buyer per car', async () => {
    expect((await offer(buyer, 18000)).status).toBe(201);
    const dup = await offer(buyer, 18500);
    expect(dup.status).toBe(409);
    expect(dup.body.error.code).toBe('OFFER_EXISTS');
    // another buyer is fine
    expect((await offer(buyer2, 18500)).status).toBe(201);
  });

  it('can offer again after withdrawing', async () => {
    const first = await offer(buyer, 18000);
    await api().post(`/api/offers/${first.body.id}/withdraw`).set(bearer(buyer.token));
    expect((await offer(buyer, 18500)).status).toBe(201);
  });

  it('car must be active / exist', async () => {
    await Car.updateOne({ _id: car.id }, { status: 'withdrawn' });
    const res = await offer(buyer, 18000);
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CAR_NOT_AVAILABLE');
    expect((await offer(buyer, 18000, '665f1c2b9a1e4b0012345678')).status).toBe(404);
  });
});

describe('listing offers', () => {
  it('seller sees offers on their car; others get 403', async () => {
    await offer(buyer, 18000);
    await offer(buyer2, 19000);
    const res = await api().get(`/api/cars/${car.id}/offers`).set(bearer(seller.token));
    expect(res.status).toBe(200);
    expect(res.body.pagination.total).toBe(2);
    expect(res.body.data[0].buyer).toMatchObject({ name: 'Buyer Two' });

    expect((await api().get(`/api/cars/${car.id}/offers`).set(bearer(buyer.token))).status).toBe(403);
  });

  it('GET /me/offers by role', async () => {
    await offer(buyer, 18000);
    const asBuyer = await api().get('/api/me/offers').set(bearer(buyer.token));
    expect(asBuyer.body.pagination.total).toBe(1);
    expect(asBuyer.body.data[0].car).toMatchObject({ id: car.id, title: 'Toyota Camry SE' });

    const asSeller = await api().get('/api/me/offers?role=seller').set(bearer(seller.token));
    expect(asSeller.body.pagination.total).toBe(1);
    const sellerAsBuyer = await api().get('/api/me/offers?role=buyer').set(bearer(seller.token));
    expect(sellerAsBuyer.body.pagination.total).toBe(0);
  });
});

describe('accept / reject / withdraw', () => {
  it('accept sells the car and rejects other pending offers', async () => {
    const a = await offer(buyer, 18000);
    const b = await offer(buyer2, 19000);

    const res = await api().post(`/api/offers/${a.body.id}/accept`).set(bearer(seller.token));
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('accepted');

    const carRes = await api().get(`/api/cars/${car.id}`);
    expect(carRes.body).toMatchObject({ status: 'sold', buyer: buyer.user.id, soldPrice: 18000 });

    const other = await api().get('/api/me/offers').set(bearer(buyer2.token));
    expect(other.body.data[0]).toMatchObject({ id: b.body.id, status: 'rejected' });

    const again = await api().post(`/api/offers/${b.body.id}/accept`).set(bearer(seller.token));
    expect(again.status).toBe(409);
    expect(again.body.error.code).toBe('OFFER_NOT_PENDING');
  });

  it('only seller can accept or reject', async () => {
    const a = await offer(buyer, 18000);
    expect((await api().post(`/api/offers/${a.body.id}/accept`).set(bearer(buyer.token))).status).toBe(403);
    expect((await api().post(`/api/offers/${a.body.id}/reject`).set(bearer(buyer2.token))).status).toBe(403);

    const rej = await api().post(`/api/offers/${a.body.id}/reject`).set(bearer(seller.token));
    expect(rej.status).toBe(200);
    expect(rej.body.status).toBe('rejected');
    expect((await api().get(`/api/cars/${car.id}`)).body.status).toBe('active');
  });

  it('only buyer can withdraw', async () => {
    const a = await offer(buyer, 18000);
    expect((await api().post(`/api/offers/${a.body.id}/withdraw`).set(bearer(seller.token))).status).toBe(403);
    const res = await api().post(`/api/offers/${a.body.id}/withdraw`).set(bearer(buyer.token));
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('withdrawn');
  });

  it('404 for unknown offer', async () => {
    const res = await api().post('/api/offers/665f1c2b9a1e4b0012345678/accept').set(bearer(seller.token));
    expect(res.status).toBe(404);
  });
});

describe('buy now', () => {
  it('buys at listed price and rejects pending offers', async () => {
    const a = await offer(buyer2, 18000);
    const res = await api().post(`/api/cars/${car.id}/buy`).set(bearer(buyer.token));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'sold', buyer: buyer.user.id, soldPrice: 20000 });

    const other = await api().get('/api/me/offers').set(bearer(buyer2.token));
    expect(other.body.data[0]).toMatchObject({ id: a.body.id, status: 'rejected' });

    const again = await api().post(`/api/cars/${car.id}/buy`).set(bearer(buyer2.token));
    expect(again.status).toBe(409);
  });

  it('cannot buy own car', async () => {
    expect((await api().post(`/api/cars/${car.id}/buy`).set(bearer(seller.token))).status).toBe(403);
  });
});

describe('concurrency', () => {
  it('two simultaneous buy-now requests: exactly one wins', async () => {
    const results = await Promise.all([
      api().post(`/api/cars/${car.id}/buy`).set(bearer(buyer.token)),
      api().post(`/api/cars/${car.id}/buy`).set(bearer(buyer2.token)),
    ]);
    const statuses = results.map((r) => r.status).sort();
    expect(statuses).toEqual([200, 409]);
  });

  it('accept and buy-now at the same time: exactly one wins, state is consistent', async () => {
    const a = await offer(buyer, 18000);
    const [accept, buy] = await Promise.all([
      api().post(`/api/offers/${a.body.id}/accept`).set(bearer(seller.token)),
      api().post(`/api/cars/${car.id}/buy`).set(bearer(buyer2.token)),
    ]);
    expect([accept.status, buy.status].sort()).toEqual([200, 409]);

    const final = (await api().get(`/api/cars/${car.id}`)).body;
    expect(final.status).toBe('sold');
    const offerState = (await api().get('/api/me/offers').set(bearer(buyer.token))).body.data[0].status;
    if (accept.status === 200) {
      expect(final.buyer).toBe(buyer.user.id);
      expect(offerState).toBe('accepted');
    } else {
      expect(final.buyer).toBe(buyer2.user.id);
      expect(offerState).toBe('rejected');
    }
  });

  it('two simultaneous offers from the same buyer: one is rejected as duplicate', async () => {
    const results = await Promise.all([offer(buyer, 18000), offer(buyer, 18100)]);
    expect(results.map((r) => r.status).sort()).toEqual([201, 409]);
  });
});
