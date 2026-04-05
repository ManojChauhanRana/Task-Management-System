import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' });

  try {
    const decoded = verifyRefreshToken(refreshToken) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

    const accessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Logged out successfully' });
};
