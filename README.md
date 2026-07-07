# OXFOX Studio

Silicone mold e-commerce site: `frontend` (Next.js 16, App Router) + `backend` (Express REST API) + MySQL.

## Prerequisites

- Node.js 18+
- MySQL Server 8.0 running locally (or update `backend/.env` to point elsewhere)

## 1. Database setup

```bash
cd backend
cp .env.example .env      # edit DB credentials if needed
npm install
npm run migrate           # creates the oxfox_studio database + tables
npm run seed               # seeds categories/subcategories, admin phone, starter FAQ
```

## 2. Backend

```bash
cd backend
npm run dev                # http://localhost:4000
```

## 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

The frontend proxies `/api/*` and `/uploads/*` to the backend (see `next.config.ts`), so always browse the site via the frontend URL (`http://localhost:3000`), not the backend port directly — this keeps the admin login cookie first-party.

## Admin panel

- URL: `http://localhost:3000/admin/login`
- Phone: `7395906336`
- OTP: `1234`

**This OTP is a static, dev-only placeholder** (see `backend/src/modules/auth/auth.service.ts`) — no real SMS is sent. Replace it with a real SMS OTP provider (e.g. MSG91, Twilio Verify) before any public launch.

## Notes

- Product images are stored on local disk under `backend/uploads/` (max 5 images/product, 10MB each) and served at `/uploads/...`.
- There is no live payment gateway yet — checkout creates a `pending_payment` order that the admin follows up on manually (COD/UPI/bank transfer) from `/admin/orders`.
- See `.claude/plans` (or the original build plan) for the full architecture writeup, schema, and assumptions made where the spec was ambiguous (Community page, comments, FAQ editability, "New" filter, search, bulk orders, promo banner).
