# URL Shortener API

A full-featured backend for a URL shortening service, built with:

- **NestJS (TypeScript)**
- **Prisma ORM**
- **PostgreSQL**
- **JWT authentication**
- Visit tracking and user dashboards

This app allows users to create, track, update, and delete short URLs — complete with analytics, rate-limiting, slug customization, and redirection support.

---

## Setup & Development

### Prerequisites

- Node.js 18+
- PostgreSQL running locally (or via Docker)
- A `.env` file configured (see below)

---

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Apply schema and migrations
npx prisma migrate dev --name init

# 4. Start the app
npm run start:dev
```

## Environment configuration

```bash
cp .env.example .env
```

Make sure to define the `JWT_SECRET` variable with a value. The `DATABASE_URL` will stay the same since the Docker image will run the database instance in the default URL (same as the `.env.example`).

## Endpoints

### Auth

> All JWT-protected routes require: `Authorization: Bearer <access_token>` ℹ️

**POST** `/auth/register`

Creates a new user.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Returns:**

```json
{ "access_token": "<jwt>" }
```

---

**POST** `/auth/login`

Login and receive a JWT.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Returns:**

```json
{ "access_token": "<jwt>" }
```

---

### URLs

**POST** `/url`

Creates a new short URL.

**Body:**

```json
{
  "originalUrl": "https://example.com",
  "slug": "custom123" // optional
}
```

> If no `slug` is provided, a random one will be generated (using the utils function `generateSlug`)

**Returns:**

```json
{
  "id": "uuid",
  "slug": "custom123",
  "originalUrl": "https://example.com",
  "visitCount": 0,
  "createdAt": "2025-07-01T00:00:00Z"
}
```

---

**PATCH** `/url/:slug`

Renames a slug.

**Body:**

```json
{ "newSlug": "new-slug" }
```

---

**DELETE** `/url/:slug`

Removes a slug of your own.

**Returns:**

```json
{ "message": "URL deleted successfully" }
```

---

**GET** `/url/:slug/stats`

Returns stats about a short URL.

**Returns:**

```json
{
  "slug": "abc123",
  "originalUrl": "https://site.com",
  "visitCount": 23,
  "lastVisit": "2025-07-01T16:00:00.000Z"
}
```

---

**GET** `/url/:slug/visits`

List of visits (most recent first).

**Returns:**

```json
[
  {
    "id": "visit-uuid",
    "ip": "123.45.67.89",
    "userAgent": "Mozilla/5.0",
    "createdAt": "2025-07-01T12:00:00.000Z"
  },
  ...
]
```

---

### Dashboard and user URLs

**GET** `/user/urls?limit=10&offset=0`

Paginated list of your created URLs.

**Returns:**

```json
{
  "total": 42,
  "limit": 10,
  "offset": 0,
  "data": [
    {
      "slug": "abc123",
      "originalUrl": "https://site.com",
      "visitCount": 23,
      "createdAt": "2025-06-30T09:00:00.000Z"
    },
    ...
  ]
}
```

---

**GET** `/dashboard/summary`

Top 5 most visited URLs (owned by the user).

**Returns:**

```json
[
  {
    "slug": "best-link",
    "originalUrl": "https://top.com",
    "visitCount": 1024,
    "createdAt": "2025-06-01T00:00:00.000Z"
  },
  ...
]
```

### Public redirect endpoint

**GET** `/r/:slug`

Returns the original URL for the given slug.

**Behavior:**

- Logs visit
- Increments counter
- Returns the original URL as a plain value

**Example:**

```bash
GET /r/abc123 → "https://example.com"
```

> Note: The frontend (`[slug].tsx`) calls this endpoint, receives the original URL, and then performs the redirect.

---

## Rate limiting

The API enforces rate limiting per IP address using a middleware.

Each IP can send up to `100` requests per 15 minutes

Applies to:

- `POST /auth/register`
- `POST /auth/login`
- All `/url` and `/r/:slug` endpoints

Exceeding the limit returns:

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Try again later."
}
```

This helps mitigate abuse on high-traffic endpoints like registration, login, and public redirects.

---

## Scaffolding structure

```
server/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── auth/
│   ├── url/
│   ├── user/
│   ├── prisma/
│   └── main.ts
├── .env
├── .env.example
└── README.md
```