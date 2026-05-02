import { Router } from 'express';
import { houseService } from '../services/instances';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { addressBody, idParam, paginationQuery } from './schema';

const router = Router();
router.use(authenticate as any);

const houseSchema = {
  list: paginationQuery,
  get: idParam,
  create: addressBody,
  update: idParam.extend(addressBody.shape),
  delete: idParam,
};

router.get('/all', async (_req, res) => {
  try {
    const houses = await houseService.getAllUnpaginated();
    res.json(houses);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', validate(houseSchema.list), async (req, res) => {
  try {
    const { page, limit } = req.query as unknown as {
      page: number;
      limit: number;
    };

    const { data, total } = await houseService.getAll(page, limit);

    res.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', validate(houseSchema.get), async (req, res) => {
  try {
    const house = await houseService.getById(req.params.id as string);
    res.json(house);
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.post('/', validate(houseSchema.create), async (req, res) => {
  try {
    const house = await houseService.create(req.body.address);
    res.status(201).json(house);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', validate(houseSchema.update), async (req, res) => {
  try {
    const house = await houseService.update(
      req.params.id as string,
      req.body.address
    );
    res.json(house);
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.delete('/:id', validate(houseSchema.delete), async (req, res) => {
  try {
    await houseService.delete(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

export default router;
