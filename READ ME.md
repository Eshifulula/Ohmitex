# Ohmitex Smart Controls Ltd - Full-Stack Application

Production-ready Next.js full-stack application with PostgreSQL, Prisma, and MinIO/S3 integration.

## 🚀 Quick Start with Docker

```bash
# Clone or navigate to the project
cd "d:\Eshy Admin\Website\ohmitex-app"

# Start all services (PostgreSQL, MinIO, Application)
docker-compose up --build

# Wait 3-5 minutes for first build, then access:
# - Website: http://localhost:3000
# - Admin: http://localhost:3000/admin/login
# - MinIO Console: http://localhost:9001
```

### Admin Credentials
- **Email**: admin@ohmitex.local
- **Password**: Admin!23456

### MinIO Credentials
- **Access Key**: minioadmin
- **Secret Key**: minioadmin123

---

## 📦 Features

### Public Website
- **Home**: Hero, Services, Projects, Clients, Why Choose Us
- **About**: Company information
- **Services**: 6 service categories with detail pages
- **Projects**: 25+ project references with case studies
- **Clients**: Trusted partner showcase
- **Contact**: Working contact form (leads to database)

### Admin Dashboard
- **Authentication**: JWT-based login system
- **Dashboard**: Statistics overview
- **Services Management**: View all services
- **Projects Management**: View all projects
- **Clients Management**: View all clients
- **Leads**: View contact form submissions

### Database Content (Auto-Seeded)
- 1 Admin user
- 6 Services (enhanced descriptions from Word document)
- 25+ Projects (comprehensive portfolio)
- 9 Clients
- All relationships properly configured

---

## 🛠️ Local Development (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL
- MinIO (optional)

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   copy .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access**: http://localhost:3000

---

## 📁 Project Structure

```
ohmitex-app/
├── app/
│   ├── (public)/          # Public pages with Header/Footer
│   │   ├── page.tsx       # Home
│   │   ├── about/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── clients/
│   │   └── contact/
│   ├── admin/             # Admin dashboard
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── clients/
│   │   └── leads/
│   ├── api/               # API routes
│   │   ├── auth/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── clients/
│   │   ├── leads/
│   │   └── uploads/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                # Base UI components
│   ├── layout/            # Header, Footer
│   ├── sections/          # Page sections
│   └── forms/             # Contact Form
├── lib/
│   ├── utils.ts          # Utilities
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # JWT authentication
│   └── s3.ts             # S3/MinIO client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data (25+ projects)
├── docker-compose.yml
├── Dockerfile
└── package.json
```

---

## 🧪 Testing

### Manual Testing
1. Visit all public pages
2. Submit contact form
3. Login to admin (/admin/login)
4. View dashboard statistics
5. Browse services, projects, clients, leads

### API Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ohmitex.local","password":"Admin!23456"}'

# Get services
curl http://localhost:3000/api/services
```

---

## 🔧 Configuration

### Environment Variables
All variables are in `.env.example`. Key configs:
- `DATABASE_URL`: PostgreSQL connection
- `JWT_SECRET`: Change in production (min 32 chars)
- `S3_*`: MinIO/S3 configuration
- `SEED_ADMIN_*`: Admin user credentials

### Prisma Commands
```bash
npx prisma studio      # Open database GUI
npx prisma db push     # Push schema changes
npx prisma db seed     # Re-seed database
npx prisma generate    # Regenerate Prisma client
```

---

## 🚢 Production Deployment

### Option A: Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option B: Vercel
```bash
npm run build
vercel deploy
```

**Important for Production:**
- Change `JWT_SECRET` to a strong random value
- Use production database (not Docker postgres)
- Use real S3 or MinIO with proper credentials
- Update admin password via database
- Set secure environment variables

---

## 📊 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Google Font (Outfit)
- **Backend**: Next.js API Routes, Zod validation
- **Auth**: Custom JWT with jose library
- **Database**: PostgreSQL + Prisma ORM
- **Storage**: MinIO (S3-compatible)
- **Deployment**: Docker + docker-compose

---

## 📝 Content Integration

All content from `Ohmitex Smart Controls Ltd (1).docx`:
- ✅ Enhanced service descriptions (DDC, MCC, BMS, IoT)
- ✅ Detailed "Why Choose Us" (Professionalism, Value, Efficiency)
- ✅ 25+ project references across all categories
- ✅ Full client list with attribution

---

## 🆘 Troubleshooting

### Docker Issues
```bash
# Stop and remove all
docker-compose down -v

# Rebuild and start fresh
docker-compose up --build
```

### Port Conflicts
Edit `docker-compose.yml` port mappings if 3000, 5432, or 9000 are in use.

### Database Not Seeding
```bash
docker-compose exec app sh
npx prisma db seed
```

---

## 📞 Support

For questions or issues, check the logs:
```bash
docker-compose logs -f app
```

---

**Built from scratch with comprehensive features and ready for deployment!** 🎉
