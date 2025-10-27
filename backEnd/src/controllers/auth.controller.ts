import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { ImageUploader } from '../middlewares/multer.middleware';
import { generateToken } from '../middlewares/jwt.middleware';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

interface uploadedImage {
  secure_url: string;
}

// auth.controller.ts
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: 'credentials missing' });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!req.file)
      return res.status(400).json({ message: 'the file is not uploaded' });
    const uploaded = (await ImageUploader(req.file.buffer)) as uploadedImage;
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        avatarUrl: uploaded.secure_url,
      },
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    res.status(500).json({ message: 'server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const authorized = await bcrypt.compare(password, user.passwordHash);
    if (!authorized) {
      return res.status(401).json({ message: 'Password incorrect' });
    }
    const userData = { id: user.id, firstName: user.firstName };
    const { accessToken, refreshToken } = await generateToken(userData);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const fetchUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await prisma.user.findUnique({ where: { id } });
    return res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the cookie in the browser
    res.clearCookie('refreshToken', {
      httpOnly: true,
      path: '/',
    });

    // Respond with success
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
