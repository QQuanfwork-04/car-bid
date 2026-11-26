import { beforeEach, describe, expect, it } from 'vitest';
import { Car } from '../src/modules/cars/car.model.js';
import { api, bearer, carInput, createCar, createUser } from './helpers.js';

describe('GET /cars pagination', () => {
  beforeEach(async () => {
    const { token } = await createUser();
    for (let i = 0; i < 25; i++) await createCar(token, { price: 10000 + i * 100, year: 2000 + (i % 20) });
  });

  it('returns pages with totals', async () => {
    const res = await api().get('/api/cars?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
    expect(res.body.pagination).toEqual({ page: 1, limit: 10, total: 25, totalPages: 3 });

    const last = await api().get('/api/cars?page=3&limit=10');
    expect(last.body.data).toHaveLength(5);

    const beyond = await api().get('/api/cars?page=4&limit=10');
    expect(beyond.status).toBe(200);
    expect(beyond.body.data).toEqual([]);
  });

  it('pages do not overlap', async () => {
    const p1 = await api().get('/api/cars?page=1&limit=10');
    const p2 = await api().get('/api/cars?page=2&limit=10');
    const ids1 = new Set(p1.body.data.map((c: { id: string }) => c.id));
    expect(p2.body.data.some((c: { id: string }) => ids1.has(c.id))).toBe(false);
  });

  it('defaults to limit 12 and rejects limit > 50', async () => {
    const res = await api().get('/api/cars');
    expect(res.body.pagination.limit).toBe(12);
    const bad = await api().get('/api/cars?limit=51');
    expect(bad.status).toBe(400);
  });

  it('includes seller summary', async () => {
    const res = await api().get('/api/cars?limit=1');
    expect(res.body.data[0].seller).toMatchObject({ id: expect.any(String), name: expect.any(String) });
    expect(res.body.data[0].seller).not.toHaveProperty('email');
  });
});

describe('GET /cars filters & sort', () => {
  beforeEach(async () => {
    const { token } = await createUser();
    await createCar(token, { make: 'Toyota', model: 'Camry', title: 'Toyota Camry', price: 18500, year: 2020, bodyType: 'sedan', fuel: 'petrol' });
    await createCar(token, { make: 'Hyundai', model: 'Tucson Hybrid', title: 'Hyundai Tucson Hybrid', price: 29500, year: 2022, bodyType: 'suv', fuel: 'hybrid' });
    await createCar(token, { make: 'Kia', model: 'K5 GT-Line', title: 'Kia K5 GT-Line', price: 23900, year: 2021, bodyType: 'sedan', fuel: 'petrol', transmission: 'manual' });
  });

  const titles = (res: { body: { data: { title: string }[] } }) => res.body.data.map((c) => c.title);

  it('filters by make case-insensitively (exact match)', async () => {
    expect(titles(await api().get('/api/cars?make=toyota'))).toEqual(['Toyota Camry']);
    expect(titles(await api().get('/api/cars?make=toy'))).toEqual([]);
  });

  it('filters by bodyType, fuel, transmission', async () => {
    expect(titles(await api().get('/api/cars?bodyType=suv'))).toEqual(['Hyundai Tucson Hybrid']);
    expect(titles(await api().get('/api/cars?fuel=hybrid'))).toEqual(['Hyundai Tucson Hybrid']);
    expect(titles(await api().get('/api/cars?transmission=manual'))).toEqual(['Kia K5 GT-Line']);
  });

  it('filters by price and year ranges', async () => {
    expect(titles(await api().get('/api/cars?minPrice=20000&maxPrice=25000'))).toEqual(['Kia K5 GT-Line']);
    expect((await api().get('/api/cars?minYear=2021')).body.pagination.total).toBe(2);
  });

  it('sorts', async () => {
    expect(titles(await api().get('/api/cars?sort=price_asc'))).toEqual(['Toyota Camry', 'Kia K5 GT-Line', 'Hyundai Tucson Hybrid']);
    expect(titles(await api().get('/api/cars?sort=price_desc'))[0]).toBe('Hyundai Tucson Hybrid');
    expect(titles(await api().get('/api/cars?sort=year_desc'))[0]).toBe('Hyundai Tucson Hybrid');
    expect(titles(await api().get('/api/cars'))[0]).toBe('Kia K5 GT-Line'); // newest
  });

  it('text search on make/model/title', async () => {
    expect(titles(await api().get('/api/cars?q=tucson'))).toEqual(['Hyundai Tucson Hybrid']);
  });

  it('rejects invalid enum', async () => {
    const res = await api().get('/api/cars?bodyType=boat');
    expect(res.status).toBe(400);
  });

  it('lists only active cars', async () => {
    await Car.updateOne({ title: 'Toyota Camry' }, { status: 'sold' });
    expect((await api().get('/api/cars')).body.pagination.total).toBe(2);
  });
});

describe('car CRUD', () => {
  it('GET /cars/:id returns the car, 404 when missing, 400 for bad id', async () => {
    const { token } = await createUser();
    const car = await createCar(token);
    const res = await api().get(`/api/cars/${car.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: car.id, title: 'Toyota Camry SE', status: 'active' });

    expect((await api().get('/api/cars/665f1c2b9a1e4b0012345678')).status).toBe(404);
    expect((await api().get('/api/cars/not-an-id')).status).toBe(400);
  });

  it('POST /cars requires auth and valid body; ignores no unknown fields', async () => {
    expect((await api().post('/api/cars').send(carInput())).status).toBe(401);
    const { token } = await createUser();
    const bad = await api().post('/api/cars').set(bearer(token)).send(carInput({ price: -5 }));
    expect(bad.status).toBe(400);
    const sneaky = await api().post('/api/cars').set(bearer(token)).send(carInput({ status: 'sold' }));
    expect(sneaky.status).toBe(400);
  });

  it('PATCH only by owner and only while active', async () => {
    const owner = await createUser();
    const other = await createUser();
    const car = await createCar(owner.token);

    const ok = await api().patch(`/api/cars/${car.id}`).set(bearer(owner.token)).send({ price: 17000, tag: 'price_drop' });
    expect(ok.status).toBe(200);
    expect(ok.body).toMatchObject({ price: 17000, tag: 'price_drop' });

    const forbidden = await api().patch(`/api/cars/${car.id}`).set(bearer(other.token)).send({ price: 1 });
    expect(forbidden.status).toBe(403);

    const empty = await api().patch(`/api/cars/${car.id}`).set(bearer(owner.token)).send({});
    expect(empty.status).toBe(400);

    await Car.updateOne({ _id: car.id }, { status: 'sold' });
    const sold = await api().patch(`/api/cars/${car.id}`).set(bearer(owner.token)).send({ price: 16000 });
    expect(sold.status).toBe(409);
    expect(sold.body.error.code).toBe('CAR_NOT_AVAILABLE');
  });

  it('DELETE withdraws and rejects pending offers', async () => {
    const owner = await createUser();
    const buyer = await createUser();
    const car = await createCar(owner.token);
    const offer = await api().post(`/api/cars/${car.id}/offers`).set(bearer(buyer.token)).send({ amount: 17000 });
    expect(offer.status).toBe(201);

    expect((await api().delete(`/api/cars/${car.id}`).set(bearer(buyer.token))).status).toBe(403);
    const res = await api().delete(`/api/cars/${car.id}`).set(bearer(owner.token));
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('withdrawn');

    const mine = await api().get('/api/me/offers?role=buyer').set(bearer(buyer.token));
    expect(mine.body.data[0].status).toBe('rejected');
  });

  it('GET /me/cars lists my cars of any status', async () => {
    const me = await createUser();
    const other = await createUser();
    const a = await createCar(me.token);
    await createCar(me.token);
    await createCar(other.token);
    await Car.updateOne({ _id: a.id }, { status: 'sold' });

    const all = await api().get('/api/me/cars').set(bearer(me.token));
    expect(all.body.pagination.total).toBe(2);
    const sold = await api().get('/api/me/cars?status=sold').set(bearer(me.token));
    expect(sold.body.data.map((c: { id: string }) => c.id)).toEqual([a.id]);
  });
});
