import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';
const JWT_EXPIRES_IN = '7d';

export const signToken = (user: User): string => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};
