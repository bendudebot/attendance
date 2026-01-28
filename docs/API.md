# API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "clxx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "TEACHER"
  },
  "token": "eyJhbG..."
}
```

### POST /auth/login

Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clxx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "TEACHER"
  },
  "token": "eyJhbG..."
}
```

### GET /auth/me

Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clxx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "TEACHER"
  }
}
```

---

## Classes Endpoints

### GET /classes

List all classes (filtered by teacher for non-admin users).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "classes": [
    {
      "id": "clxx...",
      "name": "Introduction to Programming",
      "code": "INFO-101",
      "teacherId": "clxx...",
      "teacher": {
        "id": "clxx...",
        "name": "Marie Dupont",
        "email": "marie@example.com"
      },
      "_count": {
        "students": 24,
        "sessions": 10
      }
    }
  ]
}
```

### GET /classes/:id

Get a specific class with students and recent sessions.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "class": {
    "id": "clxx...",
    "name": "Introduction to Programming",
    "code": "INFO-101",
    "students": [...],
    "sessions": [...]
  },
  "attendanceStats": [
    { "status": "PRESENT", "_count": 180 },
    { "status": "ABSENT", "_count": 12 }
  ]
}
```

### POST /classes

Create a new class.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Web Development",
  "code": "WEB-101"
}
```

**Response:** `201 Created`
```json
{
  "class": {
    "id": "clxx...",
    "name": "Web Development",
    "code": "WEB-101",
    "teacherId": "clxx..."
  }
}
```

### PUT /classes/:id

Update a class.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Advanced Web Development",
  "code": "WEB-201"
}
```

### DELETE /classes/:id

Delete a class and all related data.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Class deleted successfully"
}
```

### GET /classes/:id/report

Get attendance report for a class.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response:** `200 OK`
```json
{
  "class": { "id": "...", "name": "...", "code": "..." },
  "totalSessions": 10,
  "report": [
    {
      "student": {
        "id": "...",
        "firstName": "Alice",
        "lastName": "Martin",
        "studentId": "STU001"
      },
      "stats": {
        "total": 10,
        "present": 9,
        "absent": 0,
        "late": 1,
        "excused": 0,
        "attendanceRate": 100
      }
    }
  ]
}
```

---

## Students Endpoints

### GET /students

List all students.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `classId` (optional): Filter by class
- `search` (optional): Search by name or student ID

**Response:** `200 OK`
```json
{
  "students": [
    {
      "id": "clxx...",
      "firstName": "Alice",
      "lastName": "Martin",
      "studentId": "STU001",
      "email": "alice@student.edu",
      "class": {
        "id": "...",
        "name": "INFO-101",
        "code": "INFO-101"
      },
      "_count": {
        "attendances": 24
      }
    }
  ]
}
```

### GET /students/:id

Get a specific student with attendance history.

### POST /students

Create a new student.

**Request Body:**
```json
{
  "firstName": "Alice",
  "lastName": "Martin",
  "studentId": "STU001",
  "classId": "clxx...",
  "email": "alice@student.edu",
  "phone": "+1234567890"
}
```

### PUT /students/:id

Update a student.

### DELETE /students/:id

Delete a student.

### POST /students/import

Import students from CSV file.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: CSV file
- `classId`: Target class ID

**CSV Format:**
```csv
studentId,firstName,lastName,email,phone
STU001,Alice,Martin,alice@student.edu,+1234567890
STU002,Bob,Bernard,bob@student.edu,
```

---

## Attendance Endpoints

### GET /attendance/sessions

List sessions for a class.

**Query Parameters:**
- `classId` (required): Class ID
- `date` (optional): Filter by date

### POST /attendance/sessions

Create a new session.

**Request Body:**
```json
{
  "classId": "clxx...",
  "date": "2025-01-15T00:00:00Z",
  "startTime": "08:00",
  "endTime": "10:00",
  "topic": "Variables and Types"
}
```

### GET /attendance/sessions/:sessionId

Get session with attendance details.

### POST /attendance/mark

Mark attendance for a single student.

**Request Body:**
```json
{
  "sessionId": "clxx...",
  "studentId": "clxx...",
  "status": "PRESENT",
  "notes": "Optional note"
}
```

**Status values:** `PRESENT`, `ABSENT`, `LATE`, `EXCUSED`

### POST /attendance/mark-bulk

Mark attendance for multiple students.

**Request Body:**
```json
{
  "sessionId": "clxx...",
  "attendances": [
    { "studentId": "clxx...", "status": "PRESENT" },
    { "studentId": "clxx...", "status": "ABSENT" },
    { "studentId": "clxx...", "status": "LATE", "notes": "Arrived at 8:15" }
  ]
}
```

### POST /attendance/quick

Quick attendance: create session and mark all students.

**Request Body:**
```json
{
  "classId": "clxx...",
  "topic": "Lesson 5",
  "attendances": [
    { "studentId": "clxx...", "status": "PRESENT" },
    { "studentId": "clxx...", "status": "ABSENT" }
  ]
}
```

### GET /attendance/today

Get today's attendance summary.

**Response:** `200 OK`
```json
{
  "sessions": [...],
  "summary": {
    "totalSessions": 4,
    "totalStudents": 96,
    "present": 89,
    "absent": 2,
    "late": 4,
    "excused": 1
  }
}
```

---

## Admin Endpoints

All admin endpoints require `ADMIN` role.

### GET /admin/users

List all users.

### POST /admin/users

Create a new user.

### PUT /admin/users/:id

Update a user.

### DELETE /admin/users/:id

Delete a user.

### GET /admin/stats

Get dashboard statistics.

### GET /admin/alerts

Get students with low attendance.

**Query Parameters:**
- `threshold` (optional): Attendance threshold percentage (default: 70)

### GET /admin/export/:classId

Export class attendance to Excel.

**Query Parameters:**
- `startDate` (optional)
- `endDate` (optional)

**Response:** Excel file download

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message"
}
```

### Common Status Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |
