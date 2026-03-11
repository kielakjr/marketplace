# Marketplace

Full-stack e-commerce platform written in TypeScript. Sellers list products, buyers browse and purchase, admins manage everything. REST API backed by PostgreSQL, React frontend with Stripe payments, AWS S3 image storage, and transactional emails via Nodemailer.

<p>
  <img src="https://img.shields.io/badge/TypeScript-99.6%25-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/PostgreSQL-Sequelize-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_S3-Storage-FF9900?logo=amazons3&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## Table of Contents

- [Marketplace](#marketplace)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Buyers](#buyers)
    - [Sellers](#sellers)
    - [Admins](#admins)
    - [Authentication \& Security](#authentication--security)
    - [Frontend / UX](#frontend--ux)
  - [Tech Stack](#tech-stack)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
    - [Backend (`backend/.env`)](#backend-backendenv)
    - [Frontend (`frontend/.env`)](#frontend-frontendenv)
  - [API Reference](#api-reference)
    - [Auth — `/auth`](#auth--auth)
    - [Users — `/users`](#users--users)
    - [Products — `/products`](#products--products)
    - [Categories — `/categories`](#categories--categories)
    - [Cart — `/cart`](#cart--cart)
    - [Orders — `/orders`](#orders--orders)
    - [Payments — `/payments`](#payments--payments)
    - [Deliveries — `/deliveries`](#deliveries--deliveries)
    - [Ratings — `/ratings`](#ratings--ratings)
    - [Uploads — `/uploads`](#uploads--uploads)
    - [Admin — `/admin`](#admin--admin)
  - [Data Models](#data-models)
    - [Status enums](#status-enums)
  - [Authentication \& Security](#authentication--security-1)
  - [Frontend Routing](#frontend-routing)
  - [Scripts](#scripts)
    - [Backend (`cd backend`)](#backend-cd-backend)
    - [Frontend (`cd frontend`)](#frontend-cd-frontend)
  - [License](#license)

---

## Features

### Buyers

- **Registration & login** — email/password authentication with form validation
- **Password reset** — forgot password flow with email link (Nodemailer + Brevo), token-based reset with 30-minute expiry
- **Product browsing** — browse the catalog on the home page and dedicated products page
- **Search** — full-text product search by name
- **Filtering** — filter products by category
- **Sorting** — sort by price, date, or name (ascending/descending)
- **Pagination** — server-side paginated product listings
- **Product details** — detailed product page with image gallery, description, seller info, stock availability and breadcrumb navigation
- **Shopping cart** — add products to cart, update quantities, remove items, clear cart per seller (carts are grouped by seller)
- **Checkout** — multi-seller checkout with delivery address form (street, street number, postal code, city), simultaneous order placement for multiple sellers
- **Stripe payments** — secure card payments via Stripe Payment Intents with real-time confirmation, multi-order payment support in a single checkout session
- **Order history** — view all placed orders with status, total amount, and date
- **Order details** — detailed view of an order including items, payment status, delivery tracking, and seller info
- **Order cancellation** — cancel pending orders
- **Seller ratings** — rate sellers after completed orders (1-5 scale with comment)
- **User profiles** — view own profile and other users' profiles with ratings

### Sellers

- **Product management** — create, edit, and delete product listings
- **Image uploads via AWS S3** — upload product images directly to S3 using presigned URLs, supports JPEG, PNG, WebP, and GIF (max 5 MB per file), with upload progress tracking on the frontend
- **Stock management** — set and update available product quantity
- **Category assignment** — assign products to categories
- **My Products dashboard** — dedicated page to manage own product listings
- **Sales overview** — view incoming orders from buyers in a dedicated Sales page
- **Sale details** — detailed view of each sale with buyer info, items, payment and delivery status
- **Mark as shipped** — mark deliveries as sent from the sale detail view

### Admins

- **Dashboard with statistics** — overview panel with total users, admins, banned users, products, orders, and categories
- **User management** — list all users, toggle user roles (USER/ADMIN), update user status (ACTIVE/BANNED/DEACTIVATED)
- **Category CRUD** — create, edit, and delete product categories
- **Product oversight** — browse and manage all products across the platform
- **Order management** — view all orders, update order status (PENDING -> PROCESSING -> SHIPPED -> COMPLETED -> CANCELLED)
- **Order details** — admin-specific detailed order view with full payment and delivery management
- **Payment status management** — update payment statuses (PENDING/PAID/FAILED/REFUNDED)
- **Delivery management** — update delivery status and tracking information

### Authentication & Security

- **JWT authentication** — token-based auth with tokens stored in HTTP-only, secure cookies
- **CSRF protection** — double-submit cookie pattern with `X-CSRF-Token` header validation
- **Password hashing** — bcrypt with salt rounds
- **Password reset** — secure token-based flow with SHA-256 hashed tokens stored in DB, 30-minute expiry, emails sent via Nodemailer (Brevo transport)
- **Role-based access control** — `requireAuth`, `requireAdmin`, and `optionalAuth` middleware
- **Account status enforcement** — banned/deactivated users are blocked at the middleware level
- **Rate limiting** — global rate limit (100 req/15 min) + stricter auth-specific limiter (10 req/15 min)
- **Helmet** — HTTP security headers (Content-Security-Policy, X-Frame-Options, etc.)
- **CORS** — restricted to configured `FRONTEND_URL` with credentials support
- **Request body validation** — all inputs validated with Zod schemas
- **Request size limit** — JSON body capped at 1 MB
- **Stripe webhook verification** — signature-based validation of incoming Stripe events
- **Automatic logout** — frontend interceptor auto-redirects on 401 responses

### Frontend / UX

- **Responsive design** — mobile-friendly UI built with Tailwind CSS 4
- **Custom design system** — branded color palette (brand-50 to brand-900, cream tones), custom UI components (Button, Card, Badge, Spinner, Input, Pagination)
- **Layout system** — dedicated layouts for Root, Auth (guest-only redirect), Dashboard (user panel), and Admin Panel
- **Protected routes** — role-based route guards with loading spinners and automatic redirects
- **Stripe Elements** — integrated card input component via `@stripe/react-stripe-js` for secure payment form
- **S3 image upload** — drag-and-drop style image upload with progress bar, presigned URL flow
- **Server state management** — TanStack React Query with 5-minute stale time, retry, and caching
- **Auth state management** — Redux Toolkit with persistent auth check on app initialization
- **Axios interceptors** — automatic CSRF token attachment and 401 handling
- **Path aliases** — `@/` path alias for clean imports
- **Lucide icons** — consistent icon library throughout the UI
- **404 page** — custom not-found page with navigation back to home
- **Polish language UI** — interface fully in Polish (Zamowienia, Produkty, Platnosc, etc.)
- **Vercel deployment** — frontend configured for Vercel with SPA rewrite rules
- **ESLint** — code quality with React Hooks and React Refresh plugins
- **Vite dev proxy** — API proxy for local development

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | HTTP server & routing |
| TypeScript | Type safety |
| Sequelize + sequelize-typescript | ORM with decorators |
| PostgreSQL | Relational database |
| Stripe | Payment processing (Payment Intents, webhooks) |
| AWS S3 (@aws-sdk/client-s3) | Image storage with presigned upload URLs |
| Nodemailer + Brevo transport | Transactional emails (password reset) |
| JWT (jsonwebtoken) | Token-based authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| cookie-parser | JWT & CSRF cookie handling |
| Helmet | HTTP security headers |
| express-rate-limit | Rate limiting |
| dotenv | Environment configuration |
| CORS | Cross-origin resource sharing |

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 7 | Build tool & dev server |
| TypeScript | Type safety |
| Stripe.js + React Stripe.js | Payment form (CardElement) |
| Redux Toolkit | Auth state management |
| TanStack React Query | Server state & caching |
| React Router 7 | Client-side routing |
| Tailwind CSS 4 | Utility-first styling |
| Axios | HTTP client with interceptors |
| Lucide React | Icon library |
| clsx + tailwind-merge | Conditional class utilities |
| ESLint | Code linting |

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
│       ├── config/             # Env vars (env.ts)
│       ├── controllers/        # Request/response handlers
│       ├── services/           # Business logic (payment, s3, auth, etc.)
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
│       │   ├── UserRating.ts
│       │   └── index.ts
│       ├── routes/
│       ├── middleware/         # requireAuth, requireAdmin, optionalAuth, verifyCsrf
│       ├── validation/        # Zod schemas
│       ├── dto/               # Data transfer objects
│       ├── db/                # DB connection & seed script
│       └── utils/             # JWT helpers, cookie utilities, Stripe client, email sender
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── vercel.json            # Vercel SPA deployment config
    └── src/
        ├── main.tsx           # App entry (Redux, React Query, Router providers)
        ├── index.css          # Tailwind config with custom theme
        ├── api/               # Axios instance & API functions (auth, products, cart, orders, uploads, admin, etc.)
        ├── pages/             # Page components
        │   ├── HomePage.tsx
        │   ├── ProductsPage.tsx
        │   ├── ProductDetailPage.tsx
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── ForgotPasswordPage.tsx
        │   ├── ResetPasswordPage.tsx
        │   ├── DashboardPage.tsx
        │   ├── MyProductsPage.tsx
        │   ├── CartPage.tsx
        │   ├── CheckoutPage.tsx
        │   ├── OrdersPage.tsx
        │   ├── OrderDetailPage.tsx
        │   ├── SalesPage.tsx
        │   ├── SaleDetailPage.tsx
        │   ├── MyProfilePage.tsx
        │   ├── ProfilePage.tsx
        │   ├── NotFoundPage.tsx
        │   └── admin/
        │       ├── AdminPanelPage.tsx
        │       ├── AdminCategories.tsx
        │       ├── AdminProducts.tsx
        │       ├── AdminUsers.tsx
        │       ├── AdminOrders.tsx
        │       └── AdminOrderDetail.tsx
        ├── components/        # Reusable UI components (PaymentForm, etc.)
        ├── layouts/           # RootLayout, AuthLayout, DashboardLayout, AdminPanelLayout
        ├── router/            # Route definitions with guards
        ├── store/             # Redux store & slices (authSlice)
        ├── hooks/             # Custom hooks (useAuth, useProducts, useOrders, useUpload, etc.)
        ├── types/             # TypeScript type definitions
        └── utils/             # formatPrice, orderStatus helpers, Stripe loader, etc.
```

---

## Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- **PostgreSQL** instance (local or hosted)
- **Stripe account** — for payment processing (test keys work for development)
- **AWS account** — S3 bucket for image storage
- **Brevo (Sendinblue) account** — for transactional emails (password reset)

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/kielakjr/marketplace.git
cd marketplace

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment variables
cp .env.example .env   # then edit .env with your values

# 4. Seed the database (optional — creates sample data)
npm run db:seed

# 5. Start the backend dev server
npm run dev

# 6. In a new terminal — install frontend dependencies
cd ../frontend
npm install

# 7. Start the frontend dev server
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:5001`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5001` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret for signing JWTs | — |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `NODE_ENV` | `development` or `production` | `development` |
| `STRIPE_SECRET_KEY` | Stripe secret API key | — |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | — |
| `AWS_S3_BUCKET` | S3 bucket name for image uploads | — |
| `AWS_S3_REGION` | AWS region for the S3 bucket | `eu-central-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key | — |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | — |
| `S3_UPLOAD_MAX_SIZE_MB` | Max upload file size in MB | `5` |
| `SMTP_HOST` | SMTP server host | — |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | — |
| `SMTP_PASS` | SMTP password / Brevo API key | — |
| `SMTP_FROM` | Sender email address | `noreply@marketplace.com` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API URL (production) | `/api` (proxied in dev) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for frontend | — |

---

## API Reference

### Auth — `/auth`

| Method | Endpoint | Description | Auth | Rate Limit |
|---|---|---|---|---|
| POST | `/auth/register` | Register new user | — | 10/15 min |
| POST | `/auth/login` | Log in (sets JWT + CSRF cookies) | — | 10/15 min |
| POST | `/auth/logout` | Log out (clears cookies) | — | 10/15 min |
| POST | `/auth/forgot-password` | Request password reset email | — | 10/15 min |
| POST | `/auth/reset-password` | Reset password with token | — | 10/15 min |
| GET | `/auth/me` | Get current user | required | — |

### Users — `/users`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/users` | List all users | admin |
| GET | `/users/:id` | Get user by ID | required |
| POST | `/users` | Create user | admin |
| PUT | `/users/:id` | Update user | required |
| DELETE | `/users/:id` | Delete user | admin |
| POST | `/users/:id/toggle-role` | Toggle role (USER <-> ADMIN) | admin |
| PATCH | `/users/:id/status` | Update user status | admin |

### Products — `/products`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/products` | List products (search, filter, sort, paginate) | optional |
| GET | `/products/user/:userId` | Products by seller | — |
| GET | `/products/:id` | Product details | — |
| POST | `/products` | Create product | required |
| PUT | `/products/:id` | Update product | required |
| DELETE | `/products/:id` | Delete product | required |
| GET | `/products/admin/all` | All products (admin view) | admin |

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
| GET | `/cart` | Get all carts (grouped by seller) | required |
| POST | `/cart/items` | Add item to cart | required |
| PATCH | `/cart/items/:itemId` | Update item quantity | required |
| DELETE | `/cart/items/:itemId` | Remove item from cart | required |
| DELETE | `/cart/:sellerId` | Clear cart for a seller | required |

### Orders — `/orders`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/orders` | Create order (from cart) | required |
| GET | `/orders` | Buyer's orders | required |
| GET | `/orders/:id` | Order details | required |
| PATCH | `/orders/:id/cancel` | Cancel order | required |
| GET | `/orders/seller` | Seller's incoming orders | required |
| GET | `/orders/seller/:id` | Sale details | required |
| GET | `/orders/admin/all` | All orders | admin |
| GET | `/orders/admin/:id` | Any order (admin) | admin |
| PATCH | `/orders/admin/:id/status` | Update order status | admin |

### Payments — `/payments`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/payments/orders/:orderId/pay` | Pay for an order | required |
| POST | `/payments/orders/:orderId/create-intent` | Create Stripe Payment Intent | required |
| PATCH | `/payments/:id/status` | Update payment status | admin |
| POST | `/payments/webhook` | Stripe webhook (signature verified) | — |

### Deliveries — `/deliveries`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/deliveries/orders/:orderId` | Get delivery by order | required |
| PATCH | `/deliveries/:id` | Update delivery | admin |
| PATCH | `/deliveries/:id/sent` | Mark delivery as sent | required |

### Ratings — `/ratings`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/ratings/submit` | Submit a seller rating | required |
| GET | `/ratings/user/:userId` | Get ratings for a user | — |

### Uploads — `/uploads`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/uploads/presigned-url` | Generate S3 presigned upload URL | required |

### Admin — `/admin`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/stats` | Dashboard statistics | admin |

---

## Data Models

```
+------------+
|   User     |
|            |
| username   |
| email      |
| password   |
| role       |-------- USER | ADMIN
| status     |-------- ACTIVE | BANNED | DEACTIVATED
| bio        |
| avatar     |
+-----+------+
      |
      | 1:N                     1:N
      +---------------> +----------+           +----------+
      |                 | Product  |           |  Order   |
      |                 |          | N:M       |          |
      |                 | name     |<--------->| total    |
      |                 | images[] | OrderItem | status   |
      |                 | desc     |           | buyer_id |
      |                 | price    |           | seller_id|
      |                 | quantity |           +----+-----+
      |                 | category |                |
      |                 +----------+           1:1  |  1:1
      |                                       +----+----+
      | 1:N                              +----v---+ +---v-----+
      v                                  |Payment | |Delivery |
+----------+    1:N    +----------+      |        | |         |
|   Cart   |---------> | CartItem |      | amount | |tracking |
|          |           |          |      | status | | status  |
| user_id  |           | cart_id  |      |gateway | |order_id |
| seller_id|           | prod_id  |      +--------+ |addr_id  |
+----------+           | quantity |                +----+----+
                       +----------+                     |
                                                   1:N  v
+------------+                                   +----------+
| UserRating |                                   | Address  |
|            |                                   |          |
| reviewer_id|                                   | street   |
| rated_id   |                                   | number   |
| order_id   |                                   | postal   |
| score (1-5)|                                   | city     |
| comment    |                                   +----------+
+------------+
```

### Status enums

| Model | Values |
|---|---|
| User role | `USER`, `ADMIN` |
| User status | `ACTIVE`, `BANNED`, `DEACTIVATED` |
| Order status | `PENDING` -> `PROCESSING` -> `SHIPPED` -> `COMPLETED` / `CANCELLED` |
| Payment status | `PENDING`, `PAID`, `FAILED`, `REFUNDED` |
| Delivery status | `PENDING`, `SENT`, `DELIVERED` |

---

## Authentication & Security

- **JWT tokens** signed with `JWT_SECRET`, stored in HTTP-only secure cookies (7-day expiry)
- **CSRF protection** via double-submit cookie pattern — the server issues a non-HTTP-only CSRF cookie, and the frontend attaches it as the `X-CSRF-Token` header on every mutating request
- **Password hashing** with bcrypt
- **Password reset** — SHA-256 hashed tokens with 30-minute expiry, reset emails sent via Nodemailer (Brevo transport)
- **Route access control** via `requireAuth`, `requireAdmin`, and `optionalAuth` middleware
- **Account status check** — banned/deactivated users are rejected at the middleware level
- **Rate limiting** — global (100 req/15 min) + auth-specific (10 req/15 min)
- **Helmet** — sets secure HTTP headers
- **CORS** restricted to `FRONTEND_URL` with credentials
- **Zod validation** on all request bodies
- **Body size limit** — JSON payloads capped at 1 MB
- **Stripe webhook verification** — `stripe.webhooks.constructEvent` validates incoming webhook signatures
- **S3 presigned URLs** — time-limited (5-minute) upload URLs with file type and size validation server-side

---

## Frontend Routing

| Zone | Routes | Access |
|---|---|---|
| Public | `/`, `/products`, `/products/:id` | Everyone |
| Auth | `/login`, `/register`, `/forgot-password`, `/reset-password` | Guests only (redirects if authenticated) |
| User | `/cart`, `/checkout` | Authenticated |
| Dashboard | `/dashboard`, `/dashboard/my-products`, `/dashboard/orders`, `/dashboard/orders/:id`, `/dashboard/sales`, `/dashboard/sales/:id` | Authenticated |
| Profile | `/profile`, `/profile/:id` | Authenticated |
| Admin | `/admin`, `/admin/products`, `/admin/categories`, `/admin/users`, `/admin/orders`, `/admin/orders/:id` | Admin only |
| 404 | `*` | Everyone |

---

## Scripts

### Backend (`cd backend`)

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `nodemon src/server.ts` | Start dev server with hot reload |
| `npm run build` | `tsc` | Compile TypeScript |
| `npm start` | `node dist/server.js` | Start production server |
| `npm run db:seed` | `ts-node src/db/seed.ts` | Seed database with sample data |

### Frontend (`cd frontend`)

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite` | Start dev server |
| `npm run build` | `tsc -b && vite build` | Type-check & build for production |
| `npm run preview` | `vite preview` | Preview production build |
| `npm run lint` | `eslint .` | Run ESLint |

---

## License

This project is licensed under the MIT License.
