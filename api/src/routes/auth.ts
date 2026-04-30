import { Router, Request, Response, NextFunction } from 'express';
import { userService } from '../services/instances';
import { validate } from '../middleware/validate';
import z from 'zod';

const router = Router();

const AuthSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

router.post('/register', validate(AuthSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.register(email, password);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(AuthSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
