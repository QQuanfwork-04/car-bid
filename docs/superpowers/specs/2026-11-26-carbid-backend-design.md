# CarBid Backend — Design Spec

- **Ngày:** 2026-11-26
- **Trạng thái:** Chờ duyệt
- **Phạm vi:** Backend API cho CarBid (đăng ký/đăng nhập, danh sách xe có phân trang, offer/buy now), seed data, Swagger. **Không** gồm nối frontend.

## 1. Mục tiêu

Frontend (React + Vite) hiện chỉ có dữ liệu hardcode. Backend này cung cấp:

1. Đăng ký / đăng nhập bằng email + mật khẩu (JWT Bearer token).
2. Danh sách xe có phân trang, lọc, tìm kiếm, sắp xếp — khớp với search box ("make, model or year"), filter (Make, Price, Year, Fuel), "Browse by type" (body style) và dropdown "Sort" trên UI.
3. Mua bán theo mô hình **Offer + Buy now** (đúng câu "Buy it now at the listed price, or make an offer the seller can accept"):
   người mua gửi offer, người bán accept/reject, hoặc người mua mua ngay theo giá niêm yết.
4. Tài liệu API Swagger để test và cho frontend tham khảo.

### Ngoài phạm vi (YAGNI)
Refresh token, upload ảnh (dùng URL), xác thực email, quên mật khẩu, realtime/websocket, phân quyền admin, nối frontend.

## 2. Stack

| Thành phần | Lựa chọn |
|---|---|
| Runtime / framework | Node.js 22 + Express 5 + TypeScript |
| Database | MongoDB + Mongoose |
| Validation | zod |
| Swagger | `@asteasolutions/zod-to-openapi` (sinh OpenAPI 3.1 từ zod) + `swagger-ui-express` |
| Auth | `bcrypt` (hash, cost 10) + `jsonwebtoken` (HS256) |
| Bảo mật cơ bản | `helmet`, `cors` (origin từ env, mặc định `http://localhost:5173`) |
| Dev | `tsx watch` |
| Test | `vitest` + `supertest` + `mongodb-memory-server` |

## 3. Cấu trúc thư mục

```
server/
  package.json  tsconfig.json  .env.example  README.md
  src/
    server.ts              # connect DB + app.listen
    app.ts                 # tạo express app (export để test)
    db.ts                  # connect/disconnect mongoose
    config/env.ts          # đọc + validate env bằng zod
    docs/openapi.ts        # registry + generate OpenAPI document
    middleware/
      auth.ts              # requireAuth: verify Bearer token -> req.user
      validate.ts          # validate body/query/params bằng zod
      error.ts             # AppError + error handler + 404 handler
    modules/
      auth/   auth.routes.ts  auth.service.ts  auth.schema.ts
      users/  user.model.ts
      cars/   car.model.ts  cars.routes.ts  cars.service.ts  cars.schema.ts
      offers/ offer.model.ts  offers.routes.ts  offers.service.ts  offers.schema.ts
    utils/pagination.ts
    scripts/seed.ts
  tests/
    setup.ts  auth.test.ts  cars.test.ts  offers.test.ts  docs.test.ts
```

Mỗi module: **schema** (zod — dùng cho cả validate và Swagger), **service** (logic nghiệp vụ, không biết đến req/res), **routes** (nối middleware + gọi service + đăng ký path vào OpenAPI registry).

Root `package.json` thêm script tiện: `"server": "npm --prefix server run dev"`.

## 4. Mô hình dữ liệu

### User
| Field | Kiểu | Ghi chú |
|---|---|---|
| email | string | unique, lowercase, trim |
| passwordHash | string | `select: false`, không bao giờ trả ra API |
| name | string | 1–80 ký tự |
| location | `{ city, state }` | optional |
| createdAt / updatedAt | Date | timestamps |

### Car
| Field | Kiểu | Ghi chú |
|---|---|---|
| seller | ObjectId → User | required |
| make, model | string | vd "Toyota", "Camry SE" |
| title | string | vd "Toyota Camry SE" |
| year | number | 1950 – năm hiện tại + 1 |
| mileageKm | number | ≥ 0 |
| fuel | enum | `petrol` `diesel` `hybrid` `electric` |
| transmission | enum | `automatic` `manual` `cvt` |
| bodyType | enum | `sedan` `suv` `hatchback` `pickup` `coupe` `van` |
| price | number | số nguyên USD, > 0 |
| tag | enum? | `offers_welcome` `verified` `hot_deal` `price_drop` |
| location | `{ city, state }` | required |
| images | string[] | URL, tối đa 10 |
| description | string | optional, ≤ 2000 ký tự |
| status | enum | `active` (mặc định) `sold` `withdrawn` |
| buyer | ObjectId → User? | set khi sold |
| soldPrice | number? | set khi sold |
| createdAt / updatedAt | Date | |

Index: `{ status: 1, createdAt: -1 }`, `{ status: 1, price: 1 }`, `{ status: 1, year: -1 }`, `{ make: 1 }`, `{ seller: 1 }`, text index `{ title, make, model }`.

### Offer
| Field | Kiểu | Ghi chú |
|---|---|---|
| car | ObjectId → Car | |
| buyer | ObjectId → User | |
| seller | ObjectId → User | lưu thêm để query "offer gửi đến tôi" nhanh |
| amount | number | số nguyên USD |
| message | string? | ≤ 500 ký tự |
| status | enum | `pending` `accepted` `rejected` `withdrawn` |
| createdAt / updatedAt | Date | |

Index: unique partial `{ car: 1, buyer: 1 }` với `status: 'pending'` (mỗi buyer chỉ 1 offer pending/xe), `{ seller: 1, status: 1, createdAt: -1 }`, `{ buyer: 1, status: 1, createdAt: -1 }`.

## 5. API

Base path `/api`. 🔒 = cần header `Authorization: Bearer <token>`.

### Định dạng chung
- Thành công: trả object/resource trực tiếp; danh sách trả `{ data: T[], pagination: { page, limit, total, totalPages } }`.
- Lỗi: `{ error: { code: string, message: string, details?: unknown } }`.
- `id` trong path phải là ObjectId hợp lệ, nếu không → `400 VALIDATION_ERROR`.

### Auth
| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/auth/register` | `{ email, password (8–72), name, location? }` | `201 { token, user }` |
| POST | `/auth/login` | `{ email, password }` | `200 { token, user }` |
| GET | `/auth/me` 🔒 | — | `200 user` |

Token: payload `{ sub: userId }`, hết hạn theo `JWT_EXPIRES_IN` (mặc định `7d`).

### Cars
| Method | Path | Mô tả |
|---|---|---|
| GET | `/cars` | Danh sách xe `active`, phân trang |
| GET | `/cars/:id` | Chi tiết xe (kèm `seller { id, name, location }`) — xem được cả xe sold/withdrawn |
| POST | `/cars` 🔒 | Đăng xe, `seller` = user hiện tại |
| PATCH | `/cars/:id` 🔒 | Sửa — chỉ chủ xe, chỉ khi `active` |
| DELETE | `/cars/:id` 🔒 | Rút xe: `status = withdrawn`, reject mọi offer pending |
| GET | `/me/cars` 🔒 | Xe của tôi (mọi status), phân trang, lọc `status` |

**Query của `GET /cars`:**

| Param | Kiểu | Mặc định |
|---|---|---|
| page | int ≥ 1 | 1 |
| limit | int 1–50 | 12 |
| q | string | — (text search title/make/model) |
| make | string | — (không phân biệt hoa thường) |
| bodyType, fuel, transmission | enum | — |
| minPrice, maxPrice | int | — |
| minYear, maxYear | int | — |
| sort | `newest` `price_asc` `price_desc` `year_desc` | `newest` |

Phân trang dạng offset (`skip = (page-1)*limit`) vì UI cần hiển thị tổng số xe ("128 cars available") và có sort tùy chọn. `total` dùng `countDocuments` với cùng filter. `page` vượt quá `totalPages` → trả `data: []` (không lỗi).

### Offers / Buy now
| Method | Path | Ai | Mô tả |
|---|---|---|---|
| POST | `/cars/:id/offers` 🔒 | buyer | `{ amount, message? }` → `201 offer` |
| GET | `/cars/:id/offers` 🔒 | seller của xe | Offer của xe, phân trang, lọc `status` |
| POST | `/cars/:id/buy` 🔒 | buyer | Mua ngay theo `price` → `200 car` |
| GET | `/me/offers` 🔒 | — | `?role=buyer\|seller` (mặc định buyer), `status?`, phân trang |
| POST | `/offers/:id/accept` 🔒 | seller | → `200 offer` |
| POST | `/offers/:id/reject` 🔒 | seller | → `200 offer` |
| POST | `/offers/:id/withdraw` 🔒 | buyer | → `200 offer` |

## 6. Quy tắc nghiệp vụ

1. Không được offer hoặc buy xe của chính mình → `403 FORBIDDEN`.
2. Xe phải `active` để offer/buy/accept/sửa → nếu không `409 CAR_NOT_AVAILABLE`.
3. `0 < amount < price` → nếu không `400 VALIDATION_ERROR` (muốn trả đủ giá thì dùng buy now).
4. Đã có offer pending cho xe này → `409 OFFER_EXISTS` (bắt lỗi duplicate key từ unique partial index, nên an toàn cả khi gửi đồng thời).
5. Chỉ offer `pending` mới accept/reject/withdraw được → nếu không `409 OFFER_NOT_PENDING`.
6. Chỉ seller của xe accept/reject; chỉ buyer của offer withdraw → nếu không `403 FORBIDDEN`.
7. **Chống hai người cùng thắng một xe (accept & buy now):**
   - Bước 1 — chốt xe bằng một lệnh atomic:
     `Car.findOneAndUpdate({ _id, status: 'active' }, { status: 'sold', buyer, soldPrice }, { new: true })`.
     Nếu trả `null` → `409 CAR_NOT_AVAILABLE`. Chỉ đúng một request thắng.
   - Bước 2 (accept): offer đó → `accepted`.
   - Bước 3: mọi offer `pending` còn lại của xe → `rejected`.
   - Không dùng multi-document transaction (Mongo standalone không hỗ trợ). Nếu server chết giữa bước 1 và 3, các offer pending còn lại vô hại vì xe đã `sold` (mọi thao tác sau đều bị chặn bởi quy tắc 2).
8. Sửa xe (`PATCH`) không được đổi `seller`, `status`, `buyer`, `soldPrice`.

## 7. Auth & bảo mật

- Mật khẩu hash bằng bcrypt; `passwordHash` có `select: false` và `toJSON` xóa nó + đổi `_id` → `id`, bỏ `__v`.
- Login sai email hoặc sai mật khẩu đều trả `401 INVALID_CREDENTIALS` (không lộ email nào đã tồn tại khi login). Register email trùng → `409 EMAIL_TAKEN`.
- `requireAuth`: thiếu/sai/hết hạn token → `401 UNAUTHORIZED`; user trong token không còn tồn tại → `401 UNAUTHORIZED`.
- `JWT_SECRET` bắt buộc, tối thiểu 32 ký tự — app không khởi động nếu thiếu.
- `helmet()`, `cors({ origin: CORS_ORIGIN })`, `express.json({ limit: '100kb' })`.

## 8. Xử lý lỗi

- `AppError(status, code, message, details?)` ném từ service.
- Middleware `validate` lỗi zod → `400 VALIDATION_ERROR` với `details` = danh sách `{ path, message }`.
- Mongoose `CastError` → `400 VALIDATION_ERROR`; duplicate key `11000` → `409` (code tùy ngữ cảnh, đã map trong service).
- Route không tồn tại → `404 NOT_FOUND`. Lỗi không lường trước → `500 INTERNAL_ERROR`, log stack, không trả stack cho client.

## 9. Swagger / OpenAPI

- Dùng `@asteasolutions/zod-to-openapi`: các zod schema trong `*.schema.ts` được `.openapi({...})` để gắn tên/ví dụ, mỗi file routes đăng ký path của mình vào một `OpenAPIRegistry` chung (`registry.registerPath({ method, path, tags, security, request, responses })`).
- `docs/openapi.ts` sinh document OpenAPI 3.1: `info` (title "CarBid API", version), `servers` (`/api`), security scheme `bearerAuth` (http, bearer, JWT).
- Endpoint:
  - `GET /api/docs` — Swagger UI (`swagger-ui-express`), có nút **Authorize** để dán token, bật `persistAuthorization`.
  - `GET /api/docs.json` — OpenAPI JSON thô (cho Postman import hoặc sinh client cho frontend sau này).
- Tags: `Auth`, `Cars`, `Offers`, `Me`.
- Mỗi path khai báo response thành công + các lỗi có thể (`400/401/403/404/409`) dùng chung schema `ErrorResponse`.
- Swagger luôn bật ở môi trường dev; ở production bật/tắt bằng env `ENABLE_DOCS` (mặc định `true` — dự án học tập).

## 10. Seed data

`npm run seed` (trong `server/`): xóa sạch 3 collection rồi tạo:
- 5 user theo tên trên UI (Minh Tran – Austin TX, Sarah Le – Dallas TX, David Nguyen – Houston TX, Anna Pham – San Jose CA, Kevin Hoang – Seattle WA), mật khẩu chung `password123` (in ra console).
- ~30 xe: gồm 5 xe trong hero của UI (Toyota Camry SE $18,500, Honda Civic RS $21,200, Mazda 6 Signature $24,800, Hyundai Tucson Hybrid $29,500, Kia K5 GT-Line $23,900) + xe sinh thêm đủ các `bodyType`/`fuel` để thử filter và phân trang; vài xe `sold`.
- Một số offer mẫu ở các trạng thái khác nhau.

Seed chạy được nhiều lần (idempotent vì xóa trước khi tạo) và từ chối chạy khi `NODE_ENV=production`.

## 11. Testing

Integration test qua HTTP (`supertest` gọi `app`), DB thật trong bộ nhớ (`mongodb-memory-server`), dọn DB giữa các test.

- **auth:** register thành công / email trùng / input sai; login đúng / sai mật khẩu / email không tồn tại; `/me` có và không có token; response không chứa `passwordHash`.
- **cars:** phân trang (page, limit, total, totalPages, page vượt quá); từng filter; sort; text search; chỉ trả `active`; CRUD + quyền chủ xe; withdraw reject offer pending.
- **offers:** tạo offer (hợp lệ, xe của mình, amount ≥ price, trùng pending, xe không active); accept → xe sold + offer khác rejected; reject; withdraw; quyền; buy now; **đồng thời**: 2 request accept/buy cùng lúc (`Promise.all`) → đúng 1 thành công, 1 nhận `409`.
- **docs:** `/api/docs.json` trả OpenAPI hợp lệ và chứa đủ mọi path đã định nghĩa; `/api/docs` trả HTML.

## 12. Biến môi trường (`.env.example`)

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/carbid
JWT_SECRET=change-me-to-a-long-random-string-at-least-32-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
ENABLE_DOCS=true
```

`server/README.md` hướng dẫn: chạy MongoDB (`docker run -d -p 27017:27017 mongo:7`), `npm install`, `cp .env.example .env`, `npm run seed`, `npm run dev`, mở `http://localhost:4000/api/docs`.
