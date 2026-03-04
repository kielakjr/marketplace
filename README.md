# 🛒 Marketplace

A full-stack e-commerce marketplace platform built with **TypeScript** end-to-end. Sellers list products, buyers browse and purchase, admins oversee everything — all through a modern, responsive UI backed by a robust REST API.

<p>
  <img src="https://img.shields.io/badge/TypeScript-94.2%25-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/PostgreSQL-Sequelize-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## 📋 Table of Contents

- [🛒 Marketplace](#-marketplace)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
    - [🛍️ Buyers](#️-buyers)
    - [📦 Sellers](#-sellers)
    - [🔧 Admins](#-admins)
  - [🛠 Tech Stack](#-tech-stack)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [📁 Project Structure](#-project-structure)
  - [📌 Prerequisites](#-prerequisites)
  - [🚀 Getting Started](#-getting-started)
    - [1. Clone the repository](#1-clone-the-repository)
    - [2. Set up the backend](#2-set-up-the-backend)
    - [3. Set up the frontend](#3-set-up-the-frontend)
  - [🔐 Environment Variables](#-environment-variables)
  - [📡 API Reference](#-api-reference)
    - [Auth — `/auth`](#auth--auth)
    - [Users — `/users`](#users--users)
    - [Products — `/products`](#products--products)
    - [Categories — `/categories`](#categories--categories)
    - [Cart — `/cart`](#cart--cart)
    - [Orders — `/orders`](#orders--orders)
    - [Payments — `/payments`](#payments--payments)
    - [Deliveries — `/deliveries`](#deliveries--deliveries)
  - [🗄 Data Models](#-data-models)
    - [Status Enums](#status-enums)
  - [🔒 Authentication \& Security](#-authentication--security)
  - [🧭 Frontend Routing](#-frontend-routing)
  - [📜 Available Scripts](#-available-scripts)
    - [Backend (`cd backend`)](#backend-cd-backend)
    - [Frontend (`cd frontend`)](#frontend-cd-frontend)
  - [📄 License](#-license)

---

## ✨ Features

### 🛍️ Buyers
- Register & log in with secure credentials
- Browse products with **search**, **category filtering**, **price range**, and **sorting**
- Paginated product listings
- View detailed product pages
- Add items to cart (grouped by seller)
- Checkout with delivery address
- Pay for orders & track order status
- View full order history with details

### 📦 Sellers
- Create, edit, and delete product listings
- Upload product images (URL-based)
- Manage stock / quantity available
- View incoming orders (sales)
- Mark orders as shipped

### 🔧 Admins
- Manage all users (list, create, delete, toggle roles)
- Manage categories (CRUD)
- View & manage all orders across the platform
- Update order statuses
- Update payment & delivery statuses

---

## 🛠 Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** + **Express 5** | HTTP server & routing |
| **TypeScript** | Type safety |
| **Sequelize** + **sequelize-typescript** | ORM with decorators |
| **PostgreSQL** | Relational database |
| **JWT** (jsonwebtoken) | Token-based authentication |
| **bcrypt** | Password hashing |
| **Zod** | Request validation schemas |
| **cookie-parser** | JWT cookie handling |
| **cors** | Cross-origin resource sharing |
| **dotenv** | Environment configuration |

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **TypeScript** | Type safety |
| **Redux Toolkit** | Global state management (auth) |
| **TanStack React Query** | Server state, caching & mutations |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 4** | Utility-first styling |
| **Axios** | HTTP client |
| **Lucide React** | Icon library |
| **clsx** + **tailwind-merge** | Conditional class utilities |

---

## 📁 Project Structure

```
marketplace/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts              # Express app setup, middleware, route mounting
│       ├── server.ts           # Server entry point
│       ├── config/             # Environment config (env vars)
│       ├── controllers/        # Request/response handlers
│       │   ├── auth.ts
│       │   ├── users.ts
│       │   ├── products.ts
│       │   ├── cart.ts
│       │   ├── categories.ts
│       │   ├── orders.ts
│       │   ├── deliveries.ts
│       │   └── payments.ts
│       ├── services/           # Business logic layer
│       ├── models/             # Sequelize models (decorator-based)
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
│       ├── routes/             # Express route definitions
│       ├── middleware/         # Auth guards (requireAuth, requireAdmin)
│       ├── validation/        # Zod schemas
│       ├── dto/               # Data transfer objects
│       ├── db/                # Database connection & seed script
│       └── utils/             # Helper utilities
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx            # App entry point (providers setup)
        ├── index.css           # Tailwind imports & global styles
        ├── api/                # Axios instance & API call functions
        ├── pages/              # Page-level components
        │   ├── HomePage.tsx
        │   ├── ProductsPage.tsx
        │   ├── ProductDetailPage.tsx
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── CartPage.tsx
        │   ├── CheckoutPage.tsx
        │   ├── OrderDetailPage.tsx
        │   ├── MyProductsPage.tsx
        │   └── SaleDetailPage.tsx
        ├── components/         # Reusable UI components
        ├── layouts/            # Layout wrappers (root, auth, dashboard, admin)
        ├── router/             # Route configuration
        ├── store/              # Redux Toolkit store & slices
        ├── hooks/              # Custom React hooks
        ├── types/              # Shared TypeScript type definitions
        └── utils/              # Utility functions (formatPrice, orderStatus, etc.)
```

---

## 📌 Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x (running locally or remote)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kielakjr/marketplace.git
cd marketplace
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables)).

```bash
# Start the development server
npm run dev

# (Optional) Seed the database with sample data
npm run db:seed
```

The backend runs on `http://localhost:5001` by default.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

---

## 🔐 Environment Variables

Create a `.env` file inside `backend/` with the following variables:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the backend server listens on | `5001` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@localhost:5432/marketplace` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_super_secret_key` |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` |
| `FRONTEND_URL` | Frontend origin (used for CORS) | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |

```env
PORT=5001
DATABASE_URL=postgres://user:pass@localhost:5432/marketplace
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## 📡 API Reference

All routes are prefixed from the API root. Authentication is handled via JWT stored in HTTP-only cookies.

### Auth — `/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Log in & receive JWT cookie | ❌ |
| `POST` | `/auth/logout` | Clear auth cookie | ❌ |
| `GET` | `/auth/me` | Get current authenticated user | ✅ |

### Users — `/users`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/users` | List all users | ✅ Admin |
| `GET` | `/users/:id` | Get user by ID | ✅ |
| `POST` | `/users` | Create a new user | ✅ Admin |
| `PUT` | `/users/:id` | Update a user | ✅ |
| `DELETE` | `/users/:id` | Delete a user | ✅ Admin |
| `POST` | `/users/:id/toggle-role` | Toggle user role (USER ↔ ADMIN) | ✅ Admin |

### Products — `/products`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/products` | List products (search, filter, sort, paginate) | ❌ |
| `GET` | `/products/user/:userId` | Get products by seller | ❌ |
| `GET` | `/products/:id` | Get product details | ❌ |
| `POST` | `/products` | Create a product | ✅ |
| `PUT` | `/products/:id` | Update a product | ✅ |
| `DELETE` | `/products/:id` | Delete a product | ✅ |

### Categories — `/categories`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/categories` | List all categories | ❌ |
| `GET` | `/categories/:id` | Get category by ID | ❌ |
| `POST` | `/categories` | Create a category | ✅ Admin |
| `PUT` | `/categories/:id` | Update a category | ✅ Admin |
| `DELETE` | `/categories/:id` | Delete a category | ✅ Admin |

### Cart — `/cart`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/cart` | Get all carts (grouped by seller) | ✅ |
| `POST` | `/cart/items` | Add item to cart | ✅ |
| `PATCH` | `/cart/items/:itemId` | Update cart item quantity | ✅ |
| `DELETE` | `/cart/items/:itemId` | Remove item from cart | ✅ |
| `DELETE` | `/cart/:sellerId` | Clear cart for a specific seller | ✅ |

### Orders — `/orders`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/orders` | Create a new order | ✅ |
| `GET` | `/orders` | Get current user's orders (as buyer) | ✅ |
| `GET` | `/orders/:id` | Get order details | ✅ |
| `PATCH` | `/orders/:id/cancel` | Cancel an order | ✅ |
| `GET` | `/orders/seller` | Get orders for current seller | ✅ |
| `GET` | `/orders/seller/:id` | Get sale details | ✅ |
| `GET` | `/orders/admin/all` | List all orders | ✅ Admin |
| `GET` | `/orders/admin/:id` | Get any order (admin) | ✅ Admin |
| `PATCH` | `/orders/admin/:id/status` | Update order status | ✅ Admin |

### Payments — `/payments`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/payments/orders/:orderId/pay` | Process payment for an order | ✅ |
| `PATCH` | `/payments/:id/status` | Update payment status | ✅ Admin |

### Deliveries — `/deliveries`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/deliveries/orders/:orderId` | Get delivery info for an order | ✅ |
| `PATCH` | `/deliveries/:id` | Update delivery details | ✅ Admin |
| `PATCH` | `/deliveries/:id/sent` | Mark delivery as shipped | ✅ |

---

## 🗄 Data Models

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

### Status Enums

| Model | Possible Statuses |
|---|---|
| **Order** | `PENDING` → `PROCESSING` → `SHIPPED` → `COMPLETED` / `CANCELLED` |
| **Payment** | `PENDING` → `PAID` / `FAILED` / `REFUNDED` |
| **Delivery** | `PREPARING` → `SHIPPED` → `IN_TRANSIT` → `DELIVERED` / `FAILED_DELIVERY` |
| **User Role** | `USER` / `ADMIN` |

---

## 🔒 Authentication & Security

| Mechanism | Details |
|---|---|
| **JWT** | Tokens signed with `JWT_SECRET`, stored in HTTP-only cookies |
| **Password Hashing** | bcrypt with automatic salt generation |
| **Role-Based Access** | `requireAuth` middleware for logged-in users, `requireAdmin` for admin-only routes |
| **Input Validation** | Zod schemas validate all incoming request bodies |
| **CORS** | Restricted to `FRONTEND_URL` origin with credentials support |

---

## 🧭 Frontend Routing

| Zone | Routes | Access |
|---|---|---|
| **Public** | `/` (home), `/products`, `/products/:id` | Everyone |
| **Auth** | `/login`, `/register` | Guests only |
| **Dashboard** | `/dashboard/orders`, `/dashboard/orders/:id`, `/dashboard/sales`, `/dashboard/sales/:id`, `/dashboard/products`, `/dashboard/cart`, `/dashboard/checkout` | Authenticated |
| **Admin** | `/admin/users`, `/admin/categories`, `/admin/orders`, `/admin/orders/:id` | Admin only |

---

## 📜 Available Scripts

### Backend (`cd backend`)

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with **nodemon** (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled production build |
| `npm run db:seed` | Seed database with sample data |

### Frontend (`cd frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check & build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 📄 License

This project is licensed under the MIT License.
