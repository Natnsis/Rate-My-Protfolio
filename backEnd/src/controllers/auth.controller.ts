import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { ImageUploader } from '../middlewares/multer.middleware';
import { generateToken } from '../middlewares/jwt.middleware';

const prisma = new PrismaClient();

interface uploadedImage {
  secure_url: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(404).json({ message: 'credentials missing' });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!req.file) return res.json({ message: 'the file is not uploaded' });
    const uploaded = (await ImageUploader(req.file.buffer)) as uploadedImage;
    prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        avatarUrl: uploaded.secure_url,
      },
    });
    res.status(201).json({ message: 'message uploaded successfully' });
  } catch (e) {
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
