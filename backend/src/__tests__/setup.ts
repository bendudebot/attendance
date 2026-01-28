// Test setup
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Mock JWT_SECRET for tests
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.PORT = '3002';
