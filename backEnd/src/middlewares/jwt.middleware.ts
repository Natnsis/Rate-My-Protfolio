import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface userPayload {
  firstName: string;
  id: string;
}

export const generateToken = (userData: userPayload) => {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('access token not specified in dot env');
  }

  const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};
