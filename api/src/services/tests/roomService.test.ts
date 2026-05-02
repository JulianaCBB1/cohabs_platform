/// <reference types="jest" />
import { RoomService } from '../roomService';
import { Repository } from 'typeorm';
import { Room } from '../../entities/Room';
import { House } from '../../entities/House';
import { NotFoundError } from '../../utils/errors';
import { houseService } from '../instances';

jest.mock('../instances', () => ({
  houseService: {
    getById: jest.fn(),
  },
}));

describe('RoomService', () => {
  let roomService: RoomService;
  let mockRoomRepo: jest.Mocked<Repository<Room>>;
  const mockedHouseService = jest.mocked(houseService);

  beforeEach(() => {
    mockRoomRepo = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<Room>>;

    roomService = new RoomService(mockRoomRepo);
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('calculates pagination skip correctly for the first page', async () => {
      mockRoomRepo.findAndCount.mockResolvedValue([[], 0]);
      await roomService.getAll('h1', 1, 10);
      expect(mockRoomRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 })
      );
    });

    it('calculates pagination skip correctly for subsequent pages', async () => {
      mockRoomRepo.findAndCount.mockResolvedValue([[], 0]);
      await roomService.getAll('h1', 3, 10); // Page 3
      expect(mockRoomRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 })
      );
    });

    it('filters rooms by the provided houseId', async () => {
      mockRoomRepo.findAndCount.mockResolvedValue([[], 0]);
      await roomService.getAll('house-uuid', 1, 10);
      expect(mockRoomRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { house: { id: 'house-uuid' } },
        })
      );
    });
  });

  describe('getById', () => {
    it('returns the room when it exists', async () => {
      const mockRoom = { id: 'r1', roomNumber: 'A' } as Room;
      mockRoomRepo.findOne.mockResolvedValue(mockRoom);
      const result = await roomService.getById('r1');
      expect(result).toEqual(mockRoom);
    });

    it('throws NotFoundError when the room does not exist', async () => {
      mockRoomRepo.findOne.mockResolvedValue(null);
      await expect(roomService.getById('r1')).rejects.toThrow(NotFoundError);
      await expect(roomService.getById('r1')).rejects.toThrow(
        'Room r1 not found'
      );
    });
  });

  describe('create', () => {
    it('successfully creates a room when the house exists', async () => {
      const mockHouse = { id: 'h1' } as House;
      const mockRoom = { id: 'r1' } as Room;

      mockedHouseService.getById.mockResolvedValue(mockHouse);
      mockRoomRepo.create.mockReturnValue(mockRoom);
      mockRoomRepo.save.mockResolvedValue(mockRoom);

      const result = await roomService.create('h1', '101', 500);

      expect(mockedHouseService.getById).toHaveBeenCalledWith('h1');
      expect(mockRoomRepo.create).toHaveBeenCalledWith({
        roomNumber: '101',
        rentalPrice: 500,
        house: mockHouse,
      });
      expect(result).toBe(mockRoom);
    });

    it('fails to create a room if the house does not exist', async () => {
      mockedHouseService.getById.mockRejectedValue(
        new NotFoundError('House not found')
      );

      await expect(roomService.create('bad-h', '101', 500)).rejects.toThrow(
        NotFoundError
      );
      expect(mockRoomRepo.save).not.toHaveBeenCalled();
    });

    it('sets default Stripe IDs during creation', async () => {
      const mockRoom = {} as Room;
      mockedHouseService.getById.mockResolvedValue({ id: 'h1' } as House);
      mockRoomRepo.create.mockReturnValue(mockRoom);
      mockRoomRepo.save.mockImplementation(async (r) => r as Room);

      await roomService.create('h1', '101', 500);

      expect(mockRoom.stripeProductId).toBe('test');
      expect(mockRoom.stripePriceId).toBe('test');
    });
  });

  describe('update', () => {
    it('updates basic room details without changing Stripe IDs if price is the same', async () => {
      const existingRoom = {
        id: 'r1',
        rentalPrice: 500,
        stripePriceId: 'old-price',
      } as Room;
      mockRoomRepo.findOne.mockResolvedValue(existingRoom);

      await roomService.update('r1', 'New Number', 500);

      expect(mockRoomRepo.merge).toHaveBeenCalledWith(existingRoom, {
        roomNumber: 'New Number',
        rentalPrice: 500,
      });
      expect(existingRoom.stripePriceId).toBe('old-price'); // Should not change
    });

    it('updates stripePriceId to "test" when rentalPrice changes', async () => {
      const existingRoom = {
        id: 'r1',
        rentalPrice: 500,
        stripeProductId: 'p1',
        stripePriceId: 'old-price',
      } as Room;
      mockRoomRepo.findOne.mockResolvedValue(existingRoom);

      await roomService.update('r1', '101', 600); // 500 -> 600

      expect(existingRoom.stripePriceId).toBe('test');
    });

    it('does not trigger Stripe logic if Stripe IDs are missing', async () => {
      const existingRoom = { id: 'r1', rentalPrice: 500 } as Room; // No stripe IDs
      mockRoomRepo.findOne.mockResolvedValue(existingRoom);

      await roomService.update('r1', '101', 600);

      expect(existingRoom.stripePriceId).toBeUndefined();
    });

    it('throws NotFoundError and aborts save if room is not found', async () => {
      mockRoomRepo.findOne.mockResolvedValue(null);
      await expect(roomService.update('r1', '101', 500)).rejects.toThrow(
        NotFoundError
      );
      expect(mockRoomRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes the room when it exists', async () => {
      mockRoomRepo.findOne.mockResolvedValue({ id: 'r1' } as Room);
      await roomService.delete('r1');
      expect(mockRoomRepo.delete).toHaveBeenCalledWith('r1');
    });

    it('throws NotFoundError and aborts delete if room is not found', async () => {
      mockRoomRepo.findOne.mockResolvedValue(null);
      await expect(roomService.delete('r1')).rejects.toThrow(NotFoundError);
      expect(mockRoomRepo.delete).not.toHaveBeenCalled();
    });
  });
});
