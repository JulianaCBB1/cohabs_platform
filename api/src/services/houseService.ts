import { Repository } from 'typeorm';
import { House } from '../entities/House';
import { NotFoundError } from '../utils/errors';

export class HouseService {
  constructor(private houseRepo: Repository<House>) {}

  async getAll(
    page: number,
    limit: number
  ): Promise<{ data: House[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.houseRepo.findAndCount({
      relations: { rooms: true },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total };
  }

  async getAllUnpaginated() {
    return this.houseRepo.find({
      relations: { rooms: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getById(id: string): Promise<House> {
    const house = await this.houseRepo.findOne({
      relations: { rooms: true },
      where: { id },
    });
    if (!house) throw new NotFoundError('House not found');
    return house;
  }

  async create(address: string): Promise<House> {
    const house = this.houseRepo.create({ address });
    return await this.houseRepo.save(house);
  }

  async update(id: string, address: string): Promise<House> {
    const house = await this.getById(id);
    this.houseRepo.merge(house, { address });
    return await this.houseRepo.save(house);
  }

  async delete(id: string): Promise<void> {
    const house = await this.getById(id);
    await this.houseRepo.delete(house.id);
  }
}
