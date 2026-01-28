import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { handleValidation, asyncHandler, errorResponse } from '../middleware/validation';

const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const passwordValidation = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
];

// Helper: Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

// Register
router.post(
  '/register',
  registerValidation,
  handleValidation,
  asyncHandler(async (req: any, res: any) => {
    const { email, password, name, role = 'TEACHER' } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 400, 'Email already registered');
    }

    // Hash password & create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role === 'ADMIN' ? 'ADMIN' : 'TEACHER',
      },
      select: { id: true, email: true, name: true, role: true },
    });

    res.status(201).json({ user, token: generateToken(user.id) });
  })
);

// Login
router.post(
  '/login',
  loginValidation,
  handleValidation,
  asyncHandler(async (req: any, res: any) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token: generateToken(user.id),
    });
  })
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// Update profile
router.put(
  '/profile',
  authenticate,
  [body('name').optional().trim().notEmpty()],
  handleValidation,
  asyncHandler(async (req: AuthRequest, res: any) => {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name: req.body.name },
      select: { id: true, email: true, name: true, role: true },
    });
    res.json({ user });
  })
);

// Change password
router.put(
  '/password',
  authenticate,
  passwordValidation,
  handleValidation,
  asyncHandler(async (req: AuthRequest, res: any) => {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return errorResponse(res, 401, 'Current password is incorrect');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(newPassword, 12) },
    });

    res.json({ message: 'Password updated successfully' });
  })
);

export default router;
