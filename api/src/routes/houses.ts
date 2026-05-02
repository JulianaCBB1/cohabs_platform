import { Router } from 'express';
import { houseService } from '../services/instances';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import z from 'zod';

const router = Router();
router.use(authenticate as any);

const paginationQuery = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => Math.max(1, Number(val) || 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => Math.max(1, Math.min(100, Number(val) || 10))),
  }),
});

const idParam = z.object({
  params: z.object({
    id: z.uuid('Invalid ID format'),
  }),
});

const addressBody = z.object({
  body: z.object({
    address: z.string().min(1, 'Address is required'),
  }),
});

export const houseSchema = {
  list: paginationQuery,
  get: idParam,
  create: addressBody,
  update: idParam.merge(addressBody),
  delete: idParam,
};

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
