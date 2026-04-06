# Ohmitex Smart Controls Ltd — Website

Production-ready Next.js 15 full-stack application for [ohmitexcontrols.co.ke](https://ohmitexcontrols.co.ke) — Kenya's leading automation and smart control systems company.

---

## 🚀 Quick Start (Docker)

```bash
# Navigate to project
cd "d:\Eshy Admin\Website\ohmitex-app"

# Start all services (PostgreSQL, MinIO, App)
docker-compose up --build

# First build takes 3–5 minutes. Then access:
#   Website:      http://localhost:3000
#   Admin panel:  http://localhost:3000/admin/login
#   MinIO UI:     http://localhost:9001
```

**Default dev credentials**
| Service | Username / Email | Password |
|---|---|---|
| Admin panel | admin@ohmitex.local | Admin!23456 |
| MinIO | minioadmin | minioadmin123 |

> ⚠️ Change all defaults before going to production.

---

## 📦 Feature Overview

### Public Website
| Page | Description |
|---|---|
| `/` | Hero, Services, Projects, Clients, CTA |
| `/about` | Company profile |
| `/services` | 6 service categories with detail pages |
| `/projects` | Portfolio with case studies |
| `/clients` | Partner showcase |
| `/blog` | Blog with categories |
| `/contact` | Rate-limited contact form (honeypot protected) |
| `/privacy-policy` | Full Privacy Policy (Kenya DPA 2019 + GDPR) |
| `/terms-of-use` | Terms of Use (Kenyan law) |

### Admin Dashboard (`/admin`)
- JWT authentication with optional 2FA (TOTP)
- Dashboard with analytics overview
- CRUD for Services, Projects, Clients, Blog, Testimonials
- Media library (Cloudinary)
- Leads / enquiry management

---

## 🔒 Security

Multi-layered security following OWASP API Security best practices:

### Middleware (5 layers, every request)
1. **IP Blocklist** — `BLOCKED_IPS` env var immediately blocks known bad actors
2. **Exploit Path Blocking** — Blocks `/wp-admin`, `/.env`, `/.git`, `/phpMyAdmin`, etc.
3. **WAF URL Scanning** — Detects SQL injection & XSS patterns in URLs
4. **Body Size Guard** — Rejects payloads > 5 MB before they reach route handlers
5. **JWT Auth + Admin IP Allowlist** — Optional `ADMIN_ALLOWED_IPS` env var

### API Security
- **Device fingerprint rate limiting** — IP + User-Agent hash; harder to bypass than IP-only
- **Named profiles**: `strict` (5/10 min, forms), `auth` (5/15 min), `medium` (30/min), `lenient` (120/min)
- **Exponential backoff** — Repeat violators get progressively longer bans
- **Honeypot field** — Bots filling hidden fields are silently rejected
- **Zod validation** — All API inputs validated with length constraints

### HTTP Security Headers
- `Content-Security-Policy` — Split per route (stricter on public, permissive on `/admin` for Tiptap)
- `Strict-Transport-Security` — `max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Cross-Origin-Opener-Policy / Resource-Policy`
- `Permissions-Policy` — camera, microphone, geolocation all disabled

### Cookie Consent
- GDPR & Kenya DPA 2019 compliant banner + modal
- Granular: Essential / Analytics / Marketing toggles
- Saves to `ohmitex-cookie-consent` cookie (365 days) + localStorage
- Dispatches `cookieConsentChange` custom event for analytics integration

---

## 🛠️ Local Development (Without Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- MinIO (optional — or use Cloudinary for dev)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
copy .env.example .env
# Edit .env with your local database and service credentials

# 3. Generate Prisma client & push schema
npm run db:generate
npm run db:push

# 4. Seed database
npm run db:seed

# 5. Start dev server
npm run dev
# → http://localhost:3000
```

---

## 📁 Project Structure

```
ohmitex-app/
├── app/
│   ├── (public)/               # Public pages (Header + Footer + Cookie banner)
│   │   ├── page.tsx            # Home
│   │   ├── about/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── clients/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── privacy-policy/     # Privacy Policy page
│   │   └── terms-of-use/       # Terms of Use page
│   ├── admin/                  # Admin dashboard (JWT protected)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── clients/
│   │   ├── blog/
│   │   ├── testimonials/
│   │   ├── media/
│   │   └── leads/
│   ├── api/                    # API routes
│   │   ├── auth/               # Login, logout, 2FA, me
│   │   ├── services/
│   │   ├── projects/
│   │   ├── clients/
│   │   ├── blog/
│   │   ├── leads/              # Rate-limited + honeypot protected
│   │   ├── media/
│   │   ├── testimonials/
│   │   ├── uploads/
│   │   ├── analytics/
│   │   └── health/
│   ├── globals.css
│   ├── layout.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/                     # Radix-based UI primitives
│   ├── layout/                 # Header, Footer (with legal links)
│   ├── sections/               # Reusable page sections
│   ├── forms/                  # Contact form, project/client forms
│   ├── editor/                 # Tiptap rich-text editor
│   ├── media/                  # Media library
│   └── cookie-consent.tsx      # GDPR cookie banner + modal
├── lib/
│   ├── auth.ts                 # JWT sign/verify, session, requireAuth/Admin/Editor
│   ├── security.ts             # WAF patterns, fingerprinting, sanitization, honeypot
│   ├── rate-limit.ts           # Device-fingerprint rate limiter with profiles
│   ├── cloudinary.ts           # Cloudinary upload helper
│   ├── email.ts                # Nodemailer lead notifications
│   ├── prisma.ts               # Prisma client singleton
│   ├── s3.ts                   # S3/MinIO client
│   ├── seo.ts                  # SEO metadata helpers
│   └── utils.ts                # General utilities
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seed (services, projects, clients)
├── middleware.ts               # 5-layer WAF middleware
├── next.config.mjs             # Security headers, image domains, CSP
├── docker-compose.yml
├── Dockerfile
└── package.json
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your values.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Min 64-char random string |
| `JWT_EXPIRES_IN` | — | Default: `7d` |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `SMTP_HOST` | ✅ | Email server host |
| `SMTP_PORT` | ✅ | Email server port |
| `SMTP_USER` | ✅ | SMTP username |
| `SMTP_PASS` | ✅ | SMTP password |
| `CONTACT_EMAIL` | ✅ | Where lead emails are sent |
| `NEXT_PUBLIC_BASE_URL` | ✅ | e.g. `https://ohmitexcontrols.co.ke` |
| `BLOCKED_IPS` | — | Comma-separated IPs to block (WAF) |
| `ADMIN_ALLOWED_IPS` | — | If set, restricts `/admin` to these IPs |

### Prisma Commands
```bash
npm run db:generate    # Regenerate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed with initial data
npm run db:studio      # Open Prisma Studio GUI
```

---

## 🚢 Production Deployment

### Vercel (Recommended)
```bash
npm run build          # Verify clean build first
vercel deploy
```

Set all environment variables in the Vercel dashboard.

### Docker
```bash
docker-compose up -d --build
```

### Production Checklist
- [ ] `JWT_SECRET` set to a 64-char+ random string
- [ ] All Cloudinary credentials set
- [ ] SMTP credentials set
- [ ] `NEXT_PUBLIC_BASE_URL` set to production domain
- [ ] Admin password changed from default
- [ ] `BLOCKED_IPS` configured if needed
- [ ] HTTPS / SSL certificate active (HSTS is enforced)

---

## 🧪 Testing

### Build & Lint
```bash
npm run lint
npm run build
```

### API Health Check
```bash
curl https://ohmitexcontrols.co.ke/api/health
```

### Security Checks (manual)
```bash
# WAF — should return 400
curl "https://ohmitexcontrols.co.ke/?q=<script>alert(1)</script>"

# Exploit path blocking — should return 403
curl https://ohmitexcontrols.co.ke/wp-admin
curl https://ohmitexcontrols.co.ke/.env

# Rate limiting — 6th request in 10 min should return 429
for i in $(seq 1 6); do
  curl -X POST https://ohmitexcontrols.co.ke/api/leads \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","message":"Hello world message"}'
done
```

---

## 📊 Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + Outfit font |
| UI Primitives | Radix UI |
| Rich Text | Tiptap |
| Auth | Custom JWT (jose) + optional TOTP 2FA |
| Database | PostgreSQL + Prisma ORM 6 |
| Media Storage | Cloudinary |
| Email | Nodemailer |
| Validation | Zod |
| Error Tracking | Sentry |
| Deployment | Vercel / Docker |

---

## 📜 Legal

- **Privacy Policy**: `/privacy-policy` — Kenya Data Protection Act 2019 + GDPR compliant
- **Terms of Use**: `/terms-of-use` — Governed by Kenyan law
- **Cookie Consent**: GDPR-compliant banner with granular preferences
- **Data Protection Contact**: data@ohmitexcontrols.co.ke

---

*Built for Ohmitex Smart Controls Ltd, Nairobi, Kenya.*
