#!/bin/bash
set -e

echo "🚀 Starting Attendance Tracker..."
echo ""

cd "$(dirname "$0")/.."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo -e "${BLUE}📦 Step 1/4: Starting PostgreSQL...${NC}"
cd backend
docker-compose up -d db
echo "   Waiting for database to be ready..."
sleep 5

# Wait for PostgreSQL to be healthy
until docker-compose exec -T db pg_isready -U attendance > /dev/null 2>&1; do
    echo "   Waiting for PostgreSQL..."
    sleep 2
done
echo -e "${GREEN}   ✅ PostgreSQL is ready${NC}"

echo ""
echo -e "${BLUE}📦 Step 2/4: Running migrations...${NC}"
npm run db:migrate 2>/dev/null || npx prisma migrate deploy
echo -e "${GREEN}   ✅ Migrations complete${NC}"

echo ""
echo -e "${BLUE}🌱 Step 3/4: Seeding database...${NC}"
npm run db:seed 2>/dev/null || npx prisma db seed
echo -e "${GREEN}   ✅ Database seeded${NC}"

echo ""
echo -e "${BLUE}🖥️  Step 4/4: Starting services...${NC}"

# Start backend in background
echo "   Starting API server..."
npm run dev &
API_PID=$!

cd ../web
echo "   Starting web app..."
npm run dev &
WEB_PID=$!

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Attendance Tracker is running!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "   ${BLUE}Web Dashboard:${NC}  http://localhost:3000"
echo -e "   ${BLUE}API Server:${NC}     http://localhost:3001"
echo -e "   ${BLUE}Database:${NC}       postgresql://localhost:5432/attendance"
echo ""
echo -e "${YELLOW}📋 Test Accounts:${NC}"
echo "   Admin:   admin@attendance.app / admin123"
echo "   Teacher: teacher@attendance.app / teacher123"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for interrupt
trap "echo ''; echo 'Stopping services...'; kill $API_PID $WEB_PID 2>/dev/null; docker-compose stop; exit 0" INT TERM
wait
