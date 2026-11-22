
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './User.js';

const router = Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/'
};

// SIGN UP
router.post('/register', async (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== 'string' ||
    password.length < 8
  ) {
    return res.status(400).json({
      error: 'Enter a valid email and password of at least 8 characters.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: normalizedEmail,
      passwordHash
    });

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Email already registered.'
      });
    }

    return res.status(500).json({
      error: 'Registration failed.'
    });
  }
});

// SIGN IN
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== 'string' ||
    !email.trim() ||
    typeof password !== 'string' ||
    !password
  ) {
    return res.status(400).json({
      error: 'Email and password are required.'
    });
  }

  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (
      !user ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('hotel_token', token, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Login failed.'
    });
  }
});

// CHECK LOGIN STATUS
router.get('/me', async (req, res) => {
  const token = req.cookies?.hotel_token;

  if (!token) {
    return res.status(401).json({
      error: 'Not authenticated.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: 'Not authenticated.'
      });
    }

    return res.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(401).json({
      error: 'Not authenticated.'
    });
  }
});

// SIGN OUT
router.post('/logout', (req, res) => {
  res.clearCookie('hotel_token', cookieOptions);

  return res.json({
    message: 'Logged out successfully'
  });
});

export default router;
