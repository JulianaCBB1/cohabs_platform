/// <reference types="jest" />
import { HouseService } from '../houseService';
import { Repository } from 'typeorm';
import { House } from '../../entities/House';
import { NotFoundError } from '../../utils/errors';

describe('HouseService', () => {
  let houseService: HouseService;
  let mockHouseRepo: jest.Mocked<Repository<House>>;

  beforeEach(() => {
    mockHouseRepo = {
      findAndCount: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<House>>;

    houseService = new HouseService(mockHouseRepo);
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('calculates skip as 0 for page 1', async () => {
      mockHouseRepo.findAndCount.mockResolvedValue([[], 0]);
      await houseService.getAll(1, 10);
      expect(mockHouseRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 })
      );
    });

    it('calculates skip correctly for page 3', async () => {
      mockHouseRepo.findAndCount.mockResolvedValue([[], 0]);
      await houseService.getAll(3, 10);
      expect(mockHouseRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 })
      );
    });

    it('returns houses with the total count', async () => {
      const mockHouses = [{ id: '1' }, { id: '2' }] as House[];
      mockHouseRepo.findAndCount.mockResolvedValue([mockHouses, 2]);
      const result = await houseService.getAll(1, 10);
      expect(result).toEqual({ data: mockHouses, total: 2 });
    });

    it('includes rooms relation and correct sort order', async () => {
      mockHouseRepo.findAndCount.mockResolvedValue([[], 0]);
      await houseService.getAll(1, 10);
      expect(mockHouseRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: { rooms: true },
          order: { createdAt: 'DESC' },
        })
      );
    });
  });

  describe('getAllUnpaginated', () => {
    it('returns every house record without limits', async () => {
      const mockHouses = [{ id: '1' }, { id: '2' }] as House[];
      mockHouseRepo.find.mockResolvedValue(mockHouses);
      const result = await houseService.getAllUnpaginated();
      expect(mockHouseRepo.find).toHaveBeenCalledWith({
        relations: { rooms: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockHouses);
    });
  });

  describe('getById', () => {
    it('returns a house record when found', async () => {
      const mockHouse = { id: 'h1', address: '123 St' } as House;
      mockHouseRepo.findOne.mockResolvedValue(mockHouse);
      const result = await houseService.getById('h1');
      expect(mockHouseRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'h1' },
        relations: { rooms: true },
      });
      expect(result).toEqual(mockHouse);
    });

    it('throws NotFoundError when the house is not in the database', async () => {
      mockHouseRepo.findOne.mockResolvedValue(null);
      await expect(houseService.getById('missing')).rejects.toThrow(
        NotFoundError
      );
      await expect(houseService.getById('missing')).rejects.toThrow(
        'House not found'
      );
    });
  });

  describe('create', () => {
    it('successfully persists a new house with the provided address', async () => {
      const address = '789 Blvd';
      const mockHouse = { address } as House;
      mockHouseRepo.create.mockReturnValue(mockHouse);
      mockHouseRepo.save.mockResolvedValue({
        ...mockHouse,
        id: 'new-id',
      } as House);

      const result = await houseService.create(address);

      expect(mockHouseRepo.create).toHaveBeenCalledWith({ address });
      expect(mockHouseRepo.save).toHaveBeenCalledWith(mockHouse);
      expect(result.id).toBe('new-id');
    });
  });

  describe('update', () => {
    it('merges new data and saves the record when the house exists', async () => {
      const existingHouse = { id: 'h1', address: 'Old Ave' } as House;
      const newAddress = 'New Ave';
      mockHouseRepo.findOne.mockResolvedValue(existingHouse);
      mockHouseRepo.save.mockResolvedValue({
        ...existingHouse,
        address: newAddress,
      } as House);

      const result = await houseService.update('h1', newAddress);

      expect(mockHouseRepo.merge).toHaveBeenCalledWith(existingHouse, {
        address: newAddress,
      });
      expect(mockHouseRepo.save).toHaveBeenCalled();
      expect(result.address).toBe(newAddress);
    });

    it('aborts the update and throws if the house ID is invalid', async () => {
      mockHouseRepo.findOne.mockResolvedValue(null);
      await expect(houseService.update('none', 'addr')).rejects.toThrow(
        NotFoundError
      );
      expect(mockHouseRepo.merge).not.toHaveBeenCalled();
      expect(mockHouseRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('successfully removes the record when the house exists', async () => {
      const existingHouse = { id: 'h1' } as House;
      mockHouseRepo.findOne.mockResolvedValue(existingHouse);
      await houseService.delete('h1');
      expect(mockHouseRepo.delete).toHaveBeenCalledWith('h1');
    });

    it('throws NotFoundError and does not attempt deletion if the house is missing', async () => {
      mockHouseRepo.findOne.mockResolvedValue(null);
      await expect(houseService.delete('missing')).rejects.toThrow(
        NotFoundError
      );
      expect(mockHouseRepo.delete).not.toHaveBeenCalled();
    });
  });
});
