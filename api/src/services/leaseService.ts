import { Repository } from 'typeorm';
import { Lease } from '../entities/Lease';
import { NotFoundError } from '../utils/errors';
import { roomService, userService } from './instances';

export class LeaseService {
  constructor(private leaseRepo: Repository<Lease>) {}

  async getAll(page: number, limit: number) {
    const [data, total] = await this.leaseRepo.findAndCount({
      relations: { user: true, room: { house: true } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async getById(id: string) {
    const lease = await this.leaseRepo.findOne({
      where: { id },
      relations: { user: true, room: { house: true } },
    });
    if (!lease) throw new NotFoundError(`Lease ${id} not found`);
    return lease;
  }

  async create(
    userId: string,
    roomId: string,
    startDate: string,
    endDate?: string
  ) {
    const user = await userService.getById(userId);
    const room = await roomService.getById(roomId);
    if (!user) throw new NotFoundError(`User ${userId} not found`);
    if (!room) throw new NotFoundError(`Room ${roomId} not found`);

    const lease = this.leaseRepo.create({
      user,
      room,
      startDate,
      endDate: endDate ?? null,
    });
    return this.leaseRepo.save(lease);
  }

  async update(id: string, startDate: string, endDate?: string) {
    const lease = await this.getById(id);
    this.leaseRepo.merge(lease, { startDate, endDate: endDate ?? null });
    return this.leaseRepo.save(lease);
  }

  async delete(id: string) {
    await this.getById(id);
    await this.leaseRepo.delete(id);
  }
}
