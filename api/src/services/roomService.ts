import { Repository } from 'typeorm';
import { Room } from '../entities/Room';
import { NotFoundError } from '../utils/errors';
import { houseService } from './instances';

export class RoomService {
  constructor(private roomRepo: Repository<Room>) {}

  async getAll(houseId: string, page: number, limit: number) {
    const [data, total] = await this.roomRepo.findAndCount({
      where: { house: { id: houseId } },
      relations: { house: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async getById(id: string) {
    const room = await this.roomRepo.findOne({
      where: { id },
      relations: { house: true },
    });
    if (!room) throw new NotFoundError(`Room ${id} not found`);
    return room;
  }

  async create(houseId: string, roomNumber: string, rentalPrice: number) {
    const house = await houseService.getById(houseId);
    const room = this.roomRepo.create({ roomNumber, rentalPrice, house });

    try {
      room.stripeProductId = 'test';
      room.stripePriceId = 'test';
    } catch (err) {
      console.error('Stripe product creation failed:', err);
    }

    return this.roomRepo.save(room);
  }

  async update(id: string, roomNumber: string, rentalPrice: number) {
    const room = await this.getById(id);

    if (
      rentalPrice !== undefined &&
      Number(rentalPrice) !== Number(room.rentalPrice) &&
      room.stripeProductId &&
      room.stripePriceId
    ) {
      try {
        room.stripePriceId = 'test';
      } catch (err) {
        console.error('Stripe price replacement failed:', err);
      }
    }

    this.roomRepo.merge(room, { roomNumber, rentalPrice });
    return this.roomRepo.save(room);
  }

  async delete(id: string) {
    await this.getById(id);
    await this.roomRepo.delete(id);
  }
}
