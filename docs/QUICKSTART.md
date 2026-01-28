# 🚀 Quick Start Guide

## Prerequisites

- **Docker** & **Docker Compose** (required)
- **Node.js 20+** (for local development)
- **npm** or **yarn**

## Option 1: Docker Only (Recommended)

The fastest way to get everything running:

```bash
# Clone the repo
git clone https://github.com/bendudebot/attendance.git
cd attendance

# Make scripts executable
chmod +x scripts/*.sh

# Start everything with Docker
./scripts/docker-start.sh
```

This will:
1. ✅ Start PostgreSQL database
2. ✅ Run database migrations
3. ✅ Seed test data (users, classes, students, attendance records)
4. ✅ Start the API server

**Services:**
- API: http://localhost:3001
- Database: postgresql://localhost:5432/attendance

## Option 2: Local Development

For development with hot-reload:

```bash
# Clone the repo
git clone https://github.com/bendudebot/attendance.git
cd attendance

# Start database only
cd backend
docker-compose up -d db

# Install backend dependencies
npm install

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start backend (terminal 1)
npm run dev
```

```bash
# In a new terminal - Start web frontend
cd attendance/web
npm install
npm run dev
```

**Services:**
- Web: http://localhost:3000
- API: http://localhost:3001
- Database: postgresql://localhost:5432/attendance

## Option 3: Full Docker Stack

Run everything in containers:

```bash
cd attendance/backend
docker-compose up --build
```

## 🔐 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@attendance.app | admin123 |
| **Teacher** | teacher@attendance.app | teacher123 |

## 📊 Seeded Data

The seed script creates:
- 2 users (1 admin, 1 teacher)
- 3 classes (INFO-101, INFO-201, WEB-101)
- 15 students
- 30 sessions (10 per class, past 2 weeks)
- ~150 attendance records (randomly generated)

## 🛠️ Useful Commands

### Database

```bash
# Reset database (delete all data)
cd backend
docker-compose down -v
docker-compose up -d db
npx prisma migrate dev
npx prisma db seed

# View database in Prisma Studio
npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate
```

### Docker

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f db

# Stop all services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v

# Rebuild containers
docker-compose up --build -d
```

### Testing

```bash
# Backend tests
cd backend
npm test

# Web tests
cd web
npm test
```

## 🔧 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://attendance:attendance123@localhost:5432/attendance"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server
PORT=3001
```

### Web (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🐛 Troubleshooting

### Port already in use

```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or for port 5432 (PostgreSQL)
lsof -ti:5432 | xargs kill -9
```

### Database connection refused

```bash
# Make sure PostgreSQL is running
docker-compose ps

# Check if it's healthy
docker-compose logs db
```

### Prisma errors

```bash
# Regenerate Prisma client
npx prisma generate

# Reset everything
npx prisma migrate reset
```

## 📱 Mobile App

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go app on your phone.
