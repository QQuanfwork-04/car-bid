# CarBid API

Backend cho CarBid: đăng ký / đăng nhập, danh sách xe có phân trang, offer và mua ngay.
Express 5 + TypeScript + MongoDB (Mongoose). Thiết kế chi tiết: [`docs/superpowers/specs/2026-11-26-carbid-backend-design.md`](../docs/superpowers/specs/2026-11-26-carbid-backend-design.md).

## Chạy local

```bash
# 1. MongoDB
docker run -d --name carbid-mongo -p 27017:27017 mongo:7

# 2. Cài đặt
cd server
npm install
cp .env.example .env        # đổi JWT_SECRET thành chuỗi ngẫu nhiên ≥ 32 ký tự

# 3. Dữ liệu mẫu (5 user, 30 xe, 4 offer)
npm run seed

# 4. Chạy
npm run dev                 # http://localhost:4000
```

Mở **Swagger UI: http://localhost:4000/api/docs**
1. Gọi `POST /auth/login` với `minh@example.com` / `password123`.
2. Copy `token`, bấm **Authorize**, dán vào.
3. Thử các API có ổ khóa 🔒.

OpenAPI JSON (import vào Postman): `http://localhost:4000/api/docs.json`

## Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy dev, tự reload |
| `npm test` | Test tích hợp (MongoDB trong bộ nhớ, không cần Docker) |
| `npm run typecheck` | Kiểm tra TypeScript |
| `npm run build` / `npm start` | Build ra `dist/` và chạy |
| `npm run seed` | Xóa và tạo lại dữ liệu mẫu (không chạy khi `NODE_ENV=production`) |

## API tóm tắt

Base `/api`. 🔒 = cần header `Authorization: Bearer <token>`.

| | |
|---|---|
| `POST /auth/register`, `POST /auth/login`, `GET /auth/me` 🔒 | Tài khoản |
| `GET /cars?page&limit&q&make&bodyType&fuel&transmission&minPrice&maxPrice&minYear&maxYear&sort` | Danh sách xe đang bán |
| `GET /cars/:id`, `POST /cars` 🔒, `PATCH /cars/:id` 🔒, `DELETE /cars/:id` 🔒 | Xe |
| `POST /cars/:id/offers` 🔒, `GET /cars/:id/offers` 🔒, `POST /cars/:id/buy` 🔒 | Offer / mua ngay |
| `POST /offers/:id/accept` 🔒, `/reject` 🔒, `/withdraw` 🔒 | Xử lý offer |
| `GET /me/cars` 🔒, `GET /me/offers?role=buyer\|seller` 🔒 | Của tôi |

Danh sách trả về `{ data, pagination: { page, limit, total, totalPages } }`.
Lỗi trả về `{ error: { code, message, details? } }`.

## Cấu trúc

```
src/
  app.ts, server.ts, db.ts, config/env.ts
  docs/        zod + OpenAPI registry, sinh Swagger
  middleware/  auth (JWT), validate (zod), error
  modules/     auth, users, cars, offers  (schema → service → routes)
  scripts/seed.ts
tests/         supertest + mongodb-memory-server
```

Mỗi module có `*.schema.ts` (zod, dùng cho cả validate lẫn Swagger, nên tài liệu luôn khớp code), `*.service.ts` (nghiệp vụ) và `*.routes.ts`.
