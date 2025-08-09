# EZOrder (Next.js 14 + Tailwind)

A modern, production-ready MVP for **EZOrder** – QR code ordering with **table-specific delivery** and **real-time tracking**.

## Highlights
- App Router (Next.js 14)
- Brand-aligned UI (Inter/Open Sans, #4CAF50 / #FF9800 / #2196F3 / #F5F0E5)
- Pages: `/` (marketing), `/order` (QR flow), `/caterer`, `/admin`
- API routes: `/api/events/:id/menu`, `/api/orders`, `/api/orders/:id`, `/api/orders/:id/status`, `/api/events/:id/orders`
- In-memory DB (swap for Postgres/Prisma later)
- Recharts-based dashboard mockups

## Quick Start
```bash
npm install
npm run dev
# open http://localhost:3000
```
Try the QR parameters:
```
http://localhost:3000/order?eventId=demo-001&table=12&seat=B&name=Jane
```

## Deploy
- **Vercel** (recommended): push repo and deploy. Works out of the box.
- **Env & DB**: replace `app/lib/db.ts` with a Prisma/Postgres backend for persistence.