# Marketplace

Full-stack e-commerce platform written in TypeScript. Sellers list products, buyers browse and purchase, admins manage everything. REST API backed by PostgreSQL, React frontend.

<p>
  <img src="https://img.shields.io/badge/TypeScript-94.2%25-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/PostgreSQL-Sequelize-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## Table of Contents

- [Marketplace](#marketplace)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
  - [API Reference](#api-reference)
    - [Auth — `/auth`](#auth--auth)
    - [Users — `/users`](#users--users)
    - [Products — `/products`](#products--products)
    - [Categories — `/categories`](#categories--categories)
    - [Cart — `/cart`](#cart--cart)
    - [Orders — `/orders`](#orders--orders)
    - [Payments — `/payments`](#payments--payments)
    - [Deliveries — `/deliveries`](#deliveries--deliveries)
  - [Data Models](#data-models)
    - [Status enums](#status-enums)
  - [Authentication \& Security](#authentication--security)
  - [Frontend Routing](#frontend-routing)
  - [Scripts](#scripts)

---

## Features

**Buyers** can register, browse products with search/filter/sort/pagination, manage a cart, checkout with a delivery address, pay for orders, and track order history.

**Sellers** can create and manage product listings (with image URLs and stock), view incoming orders, and mark them as shipped.

**Admins** have full oversight: user management, category CRUD, order status updates, payment and delivery status management.

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | HTTP server & routing |
| TypeScript | Type safety |
| Sequelize + sequelize-typescript | ORM with decorators |
| PostgreSQL | Relational database |
| JWT (jsonwebtoken) | Token-based authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| cookie-parser | JWT cookie handling |

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 7 | Build tool & dev server |
| TypeScript | Type safety |
| Redux Toolkit | Auth state management |
| TanStack React Query | Server state & caching |
| React Router 7 | Client-side routing |
| Tailwind CSS 4 | Styling |
| Axios | HTTP client |
| Lucide React | Icons |

---

## Project Structure

```
marketplace/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts              # Express setup, middleware, route mounting
│       ├── server.ts           # Entry point
│       ├── config/             # Env vars
│       ├── controllers/        # Request/response handlers
│       ├── services/           # Business logic
│       ├── models/             # Sequelize models
│       │   ├── User.ts
│       │   ├── Product.ts
│       │   ├── Category.ts
│       │   ├── Cart.ts
│       │   ├── CartItem.ts
│       │   ├── Order.ts
│       │   ├── OrderItem.ts
│       │   ├── Payment.ts
│       │   ├── Delivery.ts
│       │   ├── Address.ts
│       │   └── index.ts
│       ├── routes/
│       ├── middleware/         # requireAuth, requireAdmin
│       ├── validation/         # Zod schemas
│       ├── dto/
│       ├── db/                 # DB connection & seed script
│       └── utils/
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx            # App entry (providers)
        ├── api/                # Axios instance & API functions
        ├── pages/
        ├── components/
        ├── layouts/            # Root, auth, dashboard, admin layouts
        ├── router/
        ├── store/              # Redux store & slices
        ├── hooks/
        ├── types/
        └── utils/              # formatPrice, orderStatus, etc.
```

---

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14.x

---

## Getting Started

```bash
git clone https://github.com/kielakjr/marketplace.git
cd marketplace
```

**Backend:**

```bash
cd backend
npm install
# add .env (see Environment Variables below)
npm run dev

# optionally seed the database
npm run db:seed
```

Runs on `http://localhost:5001`.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

---

## Environment Variables

Create `backend/.env`:

```env
PORT=5001
DATABASE_URL=postgres://user:pass@localhost:5432/marketplace
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiration (e.g. `7d`) |
| `FRONTEND_URL` | Frontend origin, used for CORS |
| `NODE_ENV` | `development` or `production` |

---

## API Reference

Auth is handled via JWT stored in HTTP-only cookies.

### Auth — `/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | — |
| POST | `/auth/login` | Log in, receive JWT cookie | — |
| POST | `/auth/logout` | Clear auth cookie | — |
| GET | `/auth/me` | Get current user | required |

### Users — `/users`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/users` | List all users | admin |
| GET | `/users/:id` | Get user by ID | required |
| POST | `/users` | Create user | admin |
| PUT | `/users/:id` | Update user | required |
| DELETE | `/users/:id` | Delete user | admin |
| POST | `/users/:id/toggle-role` | Toggle USER/ADMIN role | admin |

### Products — `/products`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/products` | List products (search, filter, sort, paginate) | — |
| GET | `/products/user/:userId` | Products by seller | — |
| GET | `/products/:id` | Product details | — |
| POST | `/products` | Create product | required |
| PUT | `/products/:id` | Update product | required |
| DELETE | `/products/:id` | Delete product | required |

### Categories — `/categories`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/categories` | List all categories | — |
| GET | `/categories/:id` | Get category | — |
| POST | `/categories` | Create category | admin |
| PUT | `/categories/:id` | Update category | admin |
| DELETE | `/categories/:id` | Delete category | admin |

### Cart — `/cart`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/cart` | Get carts (grouped by seller) | required |
| POST | `/cart/items` | Add item | required |
| PATCH | `/cart/items/:itemId` | Update quantity | required |
| DELETE | `/cart/items/:itemId` | Remove item | required |
| DELETE | `/cart/:sellerId` | Clear seller cart | required |

### Orders — `/orders`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/orders` | Create order | required |
| GET | `/orders` | Buyer's orders | required |
| GET | `/orders/:id` | Order details | required |
| PATCH | `/orders/:id/cancel` | Cancel order | required |
| GET | `/orders/seller` | Seller's incoming orders | required |
| GET | `/orders/seller/:id` | Sale details | required |
| GET | `/orders/admin/all` | All orders | admin |
| GET | `/orders/admin/:id` | Any order | admin |
| PATCH | `/orders/admin/:id/status` | Update order status | admin |

### Payments — `/payments`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/payments/orders/:orderId/pay` | Pay for an order | required |
| PATCH | `/payments/:id/status` | Update payment status | admin |

### Deliveries — `/deliveries`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/deliveries/orders/:orderId` | Get delivery info | required |
| PATCH | `/deliveries/:id` | Update delivery | admin |
| PATCH | `/deliveries/:id/sent` | Mark as shipped | required |

---

## Data Models

```
┌──────────┐       1:N       ┌──────────┐       N:M         ┌──────────┐
│   User   │───────────────▶ │ Product  │◀──────────────────│  Order   │
│          │                 │          │   (via OrderItem) │          │
│ id       │       1:N       │ id       │                   │ id       │
│ username │───────────────▶ │ name     │                   │ total    │
│ email    │                 │ price    │                   │ status   │
│ password │   ┌──────────┐  │ quantity │                   │ buyer_id │
│ role     │   │ Category │  │ image    │                   │ seller_id│
└──────────┘   │          │  │ desc     │                   └────┬─────┘
     │         │ id       │  └──────────┘                        │
     │         │ name     │                              ┌───────┴───────┐
     │         └──────────┘                              │               │
     │ 1:N                                          1:1  ▼          1:1  ▼
     ▼                                            ┌──────────┐  ┌───────────┐
┌──────────┐    1:N     ┌──────────┐              │ Payment  │  │ Delivery  │
│   Cart   │──────────▶ │ CartItem │              │          │  │           │
│          │            │          │              │ amount   │  │ tracking  │
│ user_id  │            │ cart_id  │              │ status   │  │ status    │
│ seller_id│            │ prod_id  │              │ gateway  │  │ order_id  │
└──────────┘            │ quantity │              └──────────┘  │ address_id│
                        └──────────┘                            └─────┬─────┘
                                                                      │
                                                                 1:N  ▼
                                                               ┌──────────┐
                                                               │ Address  │
                                                               │          │
                                                               │ street   │
                                                               │ number   │
                                                               │ city     │
                                                               │ postal   │
                                                               └──────────┘
```

### Status enums

| Model | States |
|---|---|
| Order | `PENDING` → `PROCESSING` → `SHIPPED` → `COMPLETED` / `CANCELLED` |
| Payment | `PENDING` → `PAID` / `FAILED` / `REFUNDED` |
| Delivery | `PREPARING` → `SHIPPED` → `IN_TRANSIT` → `DELIVERED` / `FAILED_DELIVERY` |
| User Role | `USER` / `ADMIN` |

---

## Authentication & Security

JWT tokens are signed with `JWT_SECRET` and stored in HTTP-only cookies. Passwords are hashed with bcrypt. Route access is controlled via `requireAuth` and `requireAdmin` middleware. All request bodies are validated with Zod. CORS is restricted to `FRONTEND_URL`.

---

## Frontend Routing

| Zone | Routes | Access |
|---|---|---|
| Public | `/`, `/products`, `/products/:id` | Everyone |
| Auth | `/login`, `/register` | Guests only |
| Dashboard | `/dashboard/orders`, `/dashboard/orders/:id`, `/dashboard/sales`, `/dashboard/sales/:id`, `/dashboard/products`, `/dashboard/cart`, `/dashboard/checkout` | Authenticated |
| Admin | `/admin/users`, `/admin/categories`, `/admin/orders`, `/admin/orders/:id` | Admin only |

---

## Scripts

**Backend** (`cd backend`):

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with nodemon |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run production build |
| `npm run db:seed` | Seed database with sample data |

**Frontend** (`cd frontend`):

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check & build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

MIT License
