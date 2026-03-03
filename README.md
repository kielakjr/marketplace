# Marketplace

A full-stack e-commerce marketplace built with Node.js/Express + TypeScript on the backend and React + Vite on the frontend. Designed to support the usual suspects: user auth, product listings, cart, orders, payments, and an admin panel.

---

## What it does

**Shoppers** can register, log in, browse products by category, manage a cart, place orders, and view order history.

**Sellers** can manage their own product listings and see orders tied to their account.

**Admins** get a panel to manage users, categories, and orders across the platform.

---

## Project structure

```
marketplace/
├── backend/    # API, business logic, database
└── frontend/   # React SPA
```

### Backend

Built on Express + TypeScript + Sequelize (PostgreSQL). Organized into:

- `routes/` — API endpoints grouped by domain (auth, users, products, cart, orders, etc.)
- `controllers/` — request/response handling
- `services/` — business logic
- `models/` — Sequelize models
- `middleware/` — auth, validation helpers
- `validation/` — Zod schemas
- `db/` — database connection

### Frontend

React 19 + Vite + TypeScript. Organized into:

- `pages/` — top-level views
- `components/` — reusable UI pieces
- `layouts/` — root, auth, admin, and dashboard layouts
- `router/` — route config
- `store/` — Redux Toolkit slices
- `api/` — backend communication layer
- `hooks/` — custom React hooks
- `types/` — shared TypeScript types

---

## Tech stack

**Backend:** Node.js, Express, TypeScript, Sequelize + sequelize-typescript, PostgreSQL, JWT, Zod, bcrypt, dotenv, cors, cookie-parser

**Frontend:** React 19, Vite, TypeScript, Redux Toolkit, React Query, Tailwind CSS, React Router

---

## Running locally

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Environment variables

Create a `.env` file in `backend/`:

```env
PORT=5001
DATABASE_URL=postgres://user:pass@localhost:5432/marketplace
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## API

Routes are registered in `backend/src/app.ts`:

```
POST /auth/...
/users
/products
/cart
/categories
/orders
/deliveries
/payments
```

---

## Data models

Sequelize models backed by PostgreSQL:

- **User** — roles: `USER` / `ADMIN`
- **Product**, **Category**
- **Cart**, **CartItem**
- **Order**, **OrderItem**
- **Payment**, **Delivery**, **Address**

Key relations: User → Products (1:N), User → Orders (1:N), User ↔ Cart (1:1), Cart → CartItems (1:N), Order ↔ Products (N:M via OrderItem), Order → Payment (1:1), Order → Delivery (1:1).

---

## Auth & security

- Sessions via JWT stored in cookies
- Passwords hashed with bcrypt
- Role-based access control (USER / ADMIN)
- CORS locked to `FRONTEND_URL`

---

## Frontend routing

Routes split into four zones: public (home, product listings, product detail), auth (login, register), user dashboard (orders, cart, profile), and admin panel (users, categories, orders).

---

## Scripts

**Backend**
```bash
npm run dev       # dev server with nodemon
npm run build     # compile TypeScript
npm run start     # run compiled output
npm run db:seed   # seed the database
```

**Frontend**
```bash
npm run dev
npm run build
npm run lint
npm run preview
```

---

## License

MIT
