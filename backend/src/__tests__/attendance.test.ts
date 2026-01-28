import request from 'supertest';
import app from '../index';
import prisma from '../lib/prisma';

describe('Attendance Routes', () => {
  let authToken: string;
  let userId: string;
  let classId: string;
  let studentId: string;
  let sessionId: string;

  const testEmail = `teacher-${Date.now()}@test.com`;

  beforeAll(async () => {
    // Create test user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: 'password123',
        name: 'Test Teacher'
      });

    authToken = registerRes.body.token;
    userId = registerRes.body.user.id;

    // Create test class
    const classRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Class',
        code: `TC-${Date.now()}`
      });

    classId = classRes.body.class.id;

    // Create test student
    const studentRes = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        studentId: `STU-${Date.now()}`,
        classId: classId
      });

    studentId = studentRes.body.student.id;
  });

  afterAll(async () => {
    // Clean up test data
    try {
      await prisma.attendance.deleteMany({ where: { sessionId } });
      await prisma.session.deleteMany({ where: { classId } });
      await prisma.student.deleteMany({ where: { classId } });
      await prisma.class.deleteMany({ where: { teacherId: userId } });
      await prisma.user.deleteMany({ where: { email: { startsWith: 'teacher-' } } });
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  describe('POST /api/attendance/sessions', () => {
    it('should create a new session', async () => {
      const today = new Date().toISOString().split('T')[0];
      const res = await request(app)
        .post('/api/attendance/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          classId,
          date: today,
          startTime: '09:00',
          endTime: '10:00',
          topic: 'Test Session'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('session');
      expect(res.body.session.topic).toBe('Test Session');

      sessionId = res.body.session.id;
    });

    it('should require classId', async () => {
      const res = await request(app)
        .post('/api/attendance/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          date: new Date().toISOString(),
          startTime: '09:00',
          endTime: '10:00'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/attendance/sessions', () => {
    it('should get sessions for a class', async () => {
      const res = await request(app)
        .get(`/api/attendance/sessions?classId=${classId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('sessions');
      expect(Array.isArray(res.body.sessions)).toBe(true);
    });

    it('should require classId parameter', async () => {
      const res = await request(app)
        .get('/api/attendance/sessions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Class ID required');
    });
  });

  describe('GET /api/attendance/sessions/:sessionId', () => {
    it('should get session with students', async () => {
      const res = await request(app)
        .get(`/api/attendance/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('session');
      expect(res.body).toHaveProperty('students');
      expect(Array.isArray(res.body.students)).toBe(true);
    });

    it('should return 404 for non-existent session', async () => {
      const res = await request(app)
        .get('/api/attendance/sessions/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/attendance/mark', () => {
    it('should mark student as present', async () => {
      const res = await request(app)
        .post('/api/attendance/mark')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          studentId,
          status: 'PRESENT',
          notes: 'On time'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('attendance');
      expect(res.body.attendance.status).toBe('PRESENT');
    });

    it('should update existing attendance', async () => {
      const res = await request(app)
        .post('/api/attendance/mark')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          studentId,
          status: 'LATE',
          notes: 'Arrived 10 minutes late'
        });

      expect(res.status).toBe(200);
      expect(res.body.attendance.status).toBe('LATE');
    });

    it('should validate status values', async () => {
      const res = await request(app)
        .post('/api/attendance/mark')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          studentId,
          status: 'INVALID_STATUS'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/attendance/mark-bulk', () => {
    it('should mark multiple students at once', async () => {
      const res = await request(app)
        .post('/api/attendance/mark-bulk')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          attendances: [
            { studentId, status: 'PRESENT' }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('attendances');
      expect(res.body).toHaveProperty('count', 1);
    });
  });

  describe('POST /api/attendance/quick', () => {
    it('should create session and mark attendance in one call', async () => {
      const res = await request(app)
        .post('/api/attendance/quick')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          classId,
          topic: 'Quick Session',
          attendances: [
            { studentId, status: 'PRESENT' }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('session');
      expect(res.body).toHaveProperty('attendances');

      // Clean up created session
      await prisma.attendance.deleteMany({
        where: { sessionId: res.body.session.id }
      });
      await prisma.session.delete({
        where: { id: res.body.session.id }
      });
    });
  });

  describe('GET /api/attendance/today', () => {
    it('should get today attendance summary', async () => {
      const res = await request(app)
        .get('/api/attendance/today')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('sessions');
      expect(res.body).toHaveProperty('summary');
      expect(res.body.summary).toHaveProperty('totalSessions');
      expect(res.body.summary).toHaveProperty('present');
      expect(res.body.summary).toHaveProperty('absent');
    });
  });
});
