<p align="center">
  <img src="https://raw.githubusercontent.com/bendudebot/attendance/main/screenshots/logo.svg" width="80" height="80" alt="Attendance Tracker Logo">
</p>

<h1 align="center">🎓 Attendance Tracker</h1>

<p align="center">
  <strong>Beautiful student attendance tracking system with Apple Glass design</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#api-documentation">API</a> •
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Prisma-5.10-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
</p>

---

## ✨ Features

### 📊 Dashboard
- Real-time attendance overview
- Today's session summary
- Quick action buttons
- Attendance alerts for low-performing students

### 👥 Student Management
- Full CRUD operations
- CSV import support
- Search and filter by class
- Individual attendance history

### 📚 Class Management
- Create and organize classes
- Assign teachers
- View class statistics
- Generate attendance reports

### ✅ Attendance Tracking
- Interactive attendance grid
- One-click status changes (Present/Absent/Late/Excused)
- Bulk operations
- Quick attendance mode

### 📈 Reports & Analytics
- Detailed attendance reports
- Export to CSV/Excel
- Low attendance alerts
- Trend analysis

### 🔐 Authentication
- JWT-based authentication
- Role-based access (Admin/Teacher)
- Secure password handling

---

## 📸 Screenshots

### Web Dashboard
<p align="center">
  <img src="screenshots/web-dashboard.png" width="800" alt="Dashboard">
</p>

### Attendance Grid
<p align="center">
  <img src="screenshots/web-attendance.png" width="800" alt="Attendance">
</p>

### Students List
<p align="center">
  <img src="screenshots/web-students.png" width="800" alt="Students">
</p>

### Reports
<p align="center">
  <img src="screenshots/web-reports.png" width="800" alt="Reports">
</p>

### Mobile App
<p align="center">
  <img src="screenshots/mobile-home.png" width="250" alt="Mobile Home">
  <img src="screenshots/mobile-list.png" width="250" alt="Mobile List">
  <img src="screenshots/mobile-history.png" width="250" alt="Mobile History">
</p>

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/bendudebot/attendance.git
cd attendance

# Start the services
cd backend
docker-compose up -d

# Run migrations and seed data
docker-compose exec api npx prisma migrate deploy
docker-compose exec api npx prisma db seed

# The API is now running at http://localhost:3001
```

### Local Development

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev

# Frontend (in another terminal)
cd web
npm install
npm run dev
```

### Test Accounts

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@attendance.app     | admin123    |
| Teacher | teacher@attendance.app   | teacher123  |

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma 5
- **Authentication**: JWT
- **Validation**: express-validator

### Frontend (Web)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts

### Mobile
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router

### Infrastructure
- **Containerization**: Docker
- **Database**: PostgreSQL (Alpine)

---

## 📖 API Documentation

See [docs/API.md](docs/API.md) for full API documentation.

### Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/classes` | List all classes |
| GET | `/api/students` | List all students |
| POST | `/api/attendance/mark` | Mark attendance |
| GET | `/api/attendance/today` | Today's summary |

---

## 🗄 Database Schema

```mermaid
erDiagram
    User ||--o{ Class : teaches
    Class ||--o{ Student : contains
    Class ||--o{ Session : has
    Student ||--o{ Attendance : has
    Session ||--o{ Attendance : records
    
    User {
        string id PK
        string email UK
        string password
        string name
        enum role
    }
    
    Class {
        string id PK
        string name
        string code UK
        string teacherId FK
    }
    
    Student {
        string id PK
        string firstName
        string lastName
        string studentId UK
        string classId FK
    }
    
    Session {
        string id PK
        string classId FK
        datetime date
        string startTime
        string endTime
    }
    
    Attendance {
        string id PK
        string studentId FK
        string sessionId FK
        enum status
        string notes
    }
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/attendance"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# Server
PORT=3001
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🚢 Deployment

### Docker Production

```bash
# Build and run
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec api npx prisma migrate deploy
```

### Manual Deployment

1. Set up a PostgreSQL database
2. Configure environment variables
3. Build and start the backend:
   ```bash
   cd backend
   npm run build
   npm start
   ```
4. Build and deploy the frontend:
   ```bash
   cd web
   npm run build
   npm start
   ```

---

## 📁 Project Structure

```
attendance/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express server
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth middleware
│   │   └── services/         # Business logic
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Seed data
│   ├── docker-compose.yml
│   └── Dockerfile
├── web/
│   ├── app/                  # Next.js pages
│   ├── components/           # React components
│   └── lib/                  # Utilities
├── mobile/                   # React Native app
├── docs/                     # Documentation
└── screenshots/              # App screenshots
```

---

## 🤝 Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/benoitliard">Benoit Liard</a>
</p>
