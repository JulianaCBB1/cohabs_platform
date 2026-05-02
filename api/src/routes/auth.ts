import { Router, Request, Response, NextFunction } from 'express';
import { userService } from '../services/instances';
import { validate } from '../middleware/validate';
import { AuthBody } from './schema';

const router = Router();

router.post('/register', validate(AuthBody), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.register(email, password);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(AuthBody), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
