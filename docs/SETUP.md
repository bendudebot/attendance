# Setup Guide

This guide covers detailed setup instructions for the Attendance Tracker application.

## Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Docker** and **Docker Compose** (recommended)
- **PostgreSQL** 15+ (if not using Docker)

## Quick Setup with Docker

The fastest way to get started:

```bash
# Clone repository
git clone https://github.com/bendudebot/attendance.git
cd attendance

# Start all services
cd backend
docker-compose up -d

# Wait for database to be ready
sleep 5

# Run migrations
docker-compose exec api npx prisma migrate deploy

# Seed the database with test data
docker-compose exec api npx prisma db seed

# Check if everything is running
docker-compose ps
```

The API should now be available at `http://localhost:3001`.

## Manual Setup

### 1. Database Setup

#### Option A: PostgreSQL via Docker

```bash
docker run -d \
  --name attendance-db \
  -e POSTGRES_USER=attendance \
  -e POSTGRES_PASSWORD=attendance123 \
  -e POSTGRES_DB=attendance \
  -p 5432:5432 \
  postgres:15-alpine
```

#### Option B: Local PostgreSQL

```bash
# Create database
createdb attendance

# Or via psql
psql -c "CREATE DATABASE attendance;"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/attendance"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (optional, adds test data)
npm run db:seed

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Environment Variables

### Backend (.env)

```env
# Database connection string
DATABASE_URL="postgresql://attendance:attendance123@localhost:5432/attendance"

# JWT secret for authentication (use a strong random string in production)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server port
PORT=3001

# Node environment
NODE_ENV=development
```

### Frontend (.env.local)

```env
# API URL (use relative path for same-origin deployment)
NEXT_PUBLIC_API_URL=/api
```

## Database Migrations

### Create a new migration

```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

### Apply migrations in production

```bash
npx prisma migrate deploy
```

### Reset database (development only)

```bash
npx prisma migrate reset
```

## Prisma Studio

View and edit your data with Prisma Studio:

```bash
cd backend
npx prisma studio
```

This opens a browser interface at `http://localhost:5555`.

## Development Workflow

### Running the full stack

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd web
npm run dev
```

### API Testing

Use the health endpoint to verify the API is running:

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-01-15T10:00:00.000Z"}
```

### Test Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@attendance.app","password":"admin123"}'
```

## Troubleshooting

### Database Connection Failed

1. Check if PostgreSQL is running:
   ```bash
   docker ps | grep postgres
   # or
   pg_isready
   ```

2. Verify connection string in `.env`

3. Check database exists:
   ```bash
   psql -l | grep attendance
   ```

### Prisma Client Not Found

Regenerate the Prisma client:
```bash
npx prisma generate
```

### Port Already in Use

Change the port in `.env` or kill the process:
```bash
lsof -i :3001
kill -9 <PID>
```

### Docker Issues

Reset Docker containers:
```bash
cd backend
docker-compose down -v
docker-compose up -d
```

## Production Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd web
npm run build
npm start
```

## Next Steps

- Read the [API Documentation](API.md)
- Check the [Contributing Guide](CONTRIBUTING.md)
- Set up the [Mobile App](../mobile/README.md)
