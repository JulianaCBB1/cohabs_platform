import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

function isJWTPayload(payload: any): payload is JWTPayload {
  return (
    payload &&
    typeof payload === 'object' &&
    typeof payload.userId === 'string' &&
    typeof payload.role === 'string'
  );
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Please provide a Bearer token',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Token missing from Bearer header',
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('CRITICAL: JWT_SECRET is missing from .env');
    return res.status(500).json({
      status: 'error',
      message: 'Internal server configuration error',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (isJWTPayload(decoded)) {
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };
      return next();
    }

    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Token payload is malformed',
    });
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Invalid or expired token',
    });
  }
};
