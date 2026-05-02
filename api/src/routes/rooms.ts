import { Router } from 'express';
import { roomService } from '../services/instances';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { houseIdParam, idParam, paginationQuery, roomBody } from './schema';

const router = Router({ mergeParams: true });
router.use(authenticate as any);

const roomSchema = {
  list: paginationQuery.extend(houseIdParam.shape),
  get: idParam,
  create: houseIdParam.extend(roomBody.shape),
  update: houseIdParam.extend(idParam.shape).extend(roomBody.partial().shape),
  delete: houseIdParam.extend(idParam.shape),
};

router.get('/', validate(roomSchema.list), async (req, res) => {
  try {
    const { page, limit } = req.query as unknown as {
      page: number;
      limit: number;
    };
    const { houseId } = req.params as { houseId: string };
    const { data, total } = await roomService.getAll(houseId, page, limit);
    res.json({
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.get('/:id', validate(roomSchema.get), async (req, res) => {
  try {
    const room = await roomService.getById(req.params.id as string);
    res.json(room);
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.post('/', validate(roomSchema.create), async (req, res) => {
  try {
    const { houseId } = req.params as { houseId: string };
    const { roomNumber, rentalPrice } = req.body;
    const room = await roomService.create(houseId, roomNumber, rentalPrice);
    res.status(201).json(room);
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.put('/:id', validate(roomSchema.update), async (req, res) => {
  try {
    const { roomNumber, rentalPrice } = req.body;
    const room = await roomService.update(
      req.params.id as string,
      roomNumber,
      rentalPrice
    );
    res.json(room);
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.delete('/:id', validate(roomSchema.delete), async (req, res) => {
  try {
    await roomService.delete(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    const status = err.name === 'NotFoundError' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

export default router;
