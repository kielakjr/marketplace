Skip to content
kielakjr
marketplace
Repository navigation
Code
Issues
Pull requests
Agents
Actions
Projects
Wiki
Security
Insights
Settings
marketplace
/
README.md
in
main

Edit

Preview
Indent mode

Spaces
Indent size

2
Line wrap mode

Soft wrap
Editing README.md file contents
497
498
499
500
501
502
503
504
505
506
507
508
509
510
511
512
513
514
515
516
517
518
519
520
521
522
523
524
525
526
527
528
529
530
531
532
533
534
535
536
537
538
539
540
541
542
543
544
545
546
547
548
549
550
551
552
553
554
555
556
557
558
559
560
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
Use Control + Shift + m to toggle the tab key moving focus. Alternatively, use esc then tab to move to the next interactive element on the page.
No file chosen
Attach files by dragging & dropping, selecting or pasting them.
