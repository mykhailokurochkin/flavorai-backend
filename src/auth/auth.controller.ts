import { Router } from 'express';
import type { Request, Response } from 'express';

import { authMiddleware } from '../middleware.js';
import { loginUser, registerUser } from '../prisma-client.ts';

interface AuthRequest extends Request {
  userId?: number;
  email?: string;
}

const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Fullname, email, and password (min 6 chars) are required.' });
  }

  try {
    const result = await registerUser(fullname, email, password);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      message: 'User registered successfully!',
      user: result.user,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await loginUser(email, password);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: 'Login successful!',
      user: result.user,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid credentials')) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

export default authRouter;