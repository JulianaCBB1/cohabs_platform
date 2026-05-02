import { Router } from 'express';
import { leaseService } from '../services/instances';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { idParam, leaseBody, leaseUpdateBody, paginationQuery } from './schema';

const router = Router();
router.use(authenticate as any);

const leaseSchema = {
  list: paginationQuery,
  get: idParam,
  create: leaseBody,
  update: idParam.extend(leaseUpdateBody.shape),
  delete: idParam,
};

router.get('/', validate(leaseSchema.list), async (req, res) => {
  try {
    const { page, limit } = req.query as unknown as {
      page: number;
      limit: number;
    };
    const { data, total } = await leaseService.getAll(page, limit);
    res.json({
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', validate(leaseSchema.get), async (req, res) => {
  try {
    const lease = await leaseService.getById(req.params.id as string);
    res.json(lease);
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.post('/', validate(leaseSchema.create), async (req, res) => {
  try {
    const { userId, roomId, startDate, endDate } = req.body;
    const lease = await leaseService.create(userId, roomId, startDate, endDate);
    res.status(201).json(lease);
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.put('/:id', validate(leaseSchema.update), async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const lease = await leaseService.update(
      req.params.id as string,
      startDate,
      endDate
    );
    res.json(lease);
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.delete('/:id', validate(leaseSchema.delete), async (req, res) => {
  try {
    await leaseService.delete(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

export default router;
