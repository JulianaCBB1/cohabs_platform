import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate as any);

router.get('/', async (_req, res) => {
  const repo = AppDataSource.getRepository(User);
  const users = await repo.find({
    select: { id: true, email: true, role: true },
  });
  res.json(users);
});

export default router;
