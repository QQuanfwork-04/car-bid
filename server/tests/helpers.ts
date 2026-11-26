import request from 'supertest';
import { createApp } from '../src/app.js';

export const app = createApp();
export const api = () => request(app);

let counter = 0;

export async function createUser(overrides: Record<string, unknown> = {}) {
  counter += 1;
  const body = {
    email: `user${counter}@example.com`,
    password: 'password123',
    name: `User ${counter}`,
    location: { city: 'Austin', state: 'TX' },
    ...overrides,
  };
  const res = await api().post('/api/auth/register').send(body);
  if (res.status !== 201) throw new Error(`register failed: ${res.status} ${JSON.stringify(res.body)}`);
  return { user: res.body.user as { id: string; email: string }, token: res.body.token as string };
}

export const carInput = (overrides: Record<string, unknown> = {}) => ({
  make: 'Toyota',
  model: 'Camry SE',
  title: 'Toyota Camry SE',
  year: 2020,
  mileageKm: 42000,
  fuel: 'petrol',
  transmission: 'automatic',
  bodyType: 'sedan',
  price: 18500,
  tag: 'offers_welcome',
  location: { city: 'Austin', state: 'TX' },
  ...overrides,
});

export async function createCar(token: string, overrides: Record<string, unknown> = {}) {
  const res = await api().post('/api/cars').set('Authorization', `Bearer ${token}`).send(carInput(overrides));
  if (res.status !== 201) throw new Error(`create car failed: ${res.status} ${JSON.stringify(res.body)}`);
  return res.body as { id: string; price: number };
}

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
