import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// ⚠️ In production, use Prisma or a real DB
const users = [
  { id: 1, email: 'user@example.com', password: 'password123' },
];

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: '✅ Login successful',
    token,
    user: { id: user.id, email: user.email },
  });
};

export const getProfile = (req: Request, res: Response) => {
  // req.user is attached by authenticateToken middleware
  res.json({
    message: '✅ Protected route accessed!',
    user: req.user,
  });
};