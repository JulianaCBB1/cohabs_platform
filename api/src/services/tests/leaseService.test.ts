/// <reference types="jest" />
import { LeaseService } from '../leaseService';
import { Repository } from 'typeorm';
import { Lease } from '../../entities/Lease';
import { User } from '../../entities/User';
import { Room } from '../../entities/Room';
import { NotFoundError } from '../../utils/errors';
import { userService, roomService } from '../instances';

jest.mock('../instances', () => ({
  userService: {
    getById: jest.fn(),
  },
  roomService: {
    getById: jest.fn(),
  },
}));

describe('LeaseService', () => {
  let leaseService: LeaseService;
  let mockLeaseRepo: jest.Mocked<Repository<Lease>>;
  const mockedUserService = jest.mocked(userService);
  const mockedRoomService = jest.mocked(roomService);

  beforeEach(() => {
    mockLeaseRepo = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<Lease>>;

    leaseService = new LeaseService(mockLeaseRepo);
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('calculates skip as 0 for the first page', async () => {
      mockLeaseRepo.findAndCount.mockResolvedValue([[], 0]);
      await leaseService.getAll(1, 10);
      expect(mockLeaseRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 })
      );
    });

    it('calculates skip correctly for subsequent pages', async () => {
      mockLeaseRepo.findAndCount.mockResolvedValue([[], 0]);
      await leaseService.getAll(3, 5);
      expect(mockLeaseRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 5 })
      );
    });

    it('requests nested relations for user and room house', async () => {
      mockLeaseRepo.findAndCount.mockResolvedValue([[], 0]);
      await leaseService.getAll(1, 10);
      expect(mockLeaseRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: { user: true, room: { house: true } },
        })
      );
    });
  });

  describe('getById', () => {
    it('returns the lease when a valid ID is provided', async () => {
      const mockLease = { id: 'l1' } as Lease;
      mockLeaseRepo.findOne.mockResolvedValue(mockLease);
      const result = await leaseService.getById('l1');
      expect(result).toEqual(mockLease);
    });

    it('throws NotFoundError when the lease is not found', async () => {
      mockLeaseRepo.findOne.mockResolvedValue(null);
      await expect(leaseService.getById('missing')).rejects.toThrow(
        NotFoundError
      );
      await expect(leaseService.getById('missing')).rejects.toThrow(
        'Lease missing not found'
      );
    });
  });

  describe('create', () => {
    it('saves a new lease when user and room exist', async () => {
      const mockUser = { id: 'u1' } as User;
      const mockRoom = { id: 'r1' } as Room;
      const mockLease = { id: 'l1' } as Lease;
      const startDate = '2026-01-01';

      mockedUserService.getById.mockResolvedValue(mockUser);
      mockedRoomService.getById.mockResolvedValue(mockRoom);
      mockLeaseRepo.create.mockReturnValue(mockLease);
      mockLeaseRepo.save.mockResolvedValue(mockLease);

      const result = await leaseService.create('u1', 'r1', startDate);

      expect(mockedUserService.getById).toHaveBeenCalledWith('u1');
      expect(mockedRoomService.getById).toHaveBeenCalledWith('r1');
      expect(mockLeaseRepo.create).toHaveBeenCalledWith({
        user: mockUser,
        room: mockRoom,
        startDate,
        endDate: null,
      });
      expect(result).toEqual(mockLease);
    });

    it('sets the endDate if provided in the arguments', async () => {
      const mockUser = { id: 'u1' } as User;
      const mockRoom = { id: 'r1' } as Room;
      mockedUserService.getById.mockResolvedValue(mockUser);
      mockedRoomService.getById.mockResolvedValue(mockRoom);

      await leaseService.create('u1', 'r1', '2026-01-01', '2026-12-31');

      expect(mockLeaseRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ endDate: '2026-12-31' })
      );
    });

    it('throws NotFoundError if the user is not found', async () => {
      mockedUserService.getById.mockResolvedValue(null as any);
      await expect(leaseService.create('bad-u', 'r1', '2026')).rejects.toThrow(
        NotFoundError
      );
      expect(mockLeaseRepo.save).not.toHaveBeenCalled();
    });

    it('throws NotFoundError if the room is not found', async () => {
      mockedUserService.getById.mockResolvedValue({ id: 'u1' } as User);
      mockedRoomService.getById.mockResolvedValue(null as any);
      await expect(leaseService.create('u1', 'bad-r', '2026')).rejects.toThrow(
        NotFoundError
      );
      expect(mockLeaseRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('merges new dates and saves when the lease exists', async () => {
      const existingLease = { id: 'l1' } as Lease;
      mockLeaseRepo.findOne.mockResolvedValue(existingLease);
      mockLeaseRepo.save.mockResolvedValue({
        ...existingLease,
        startDate: '2027',
      } as Lease);

      await leaseService.update('l1', '2027');

      expect(mockLeaseRepo.merge).toHaveBeenCalledWith(existingLease, {
        startDate: '2027',
        endDate: null,
      });
      expect(mockLeaseRepo.save).toHaveBeenCalled();
    });

    it('aborts and throws if the lease to update does not exist', async () => {
      mockLeaseRepo.findOne.mockResolvedValue(null);
      await expect(leaseService.update('bad-l', '2027')).rejects.toThrow(
        NotFoundError
      );
      expect(mockLeaseRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes the record when the lease is found', async () => {
      mockLeaseRepo.findOne.mockResolvedValue({ id: 'l1' } as Lease);
      await leaseService.delete('l1');
      expect(mockLeaseRepo.delete).toHaveBeenCalledWith('l1');
    });

    it('aborts and throws if the lease to delete does not exist', async () => {
      mockLeaseRepo.findOne.mockResolvedValue(null);
      await expect(leaseService.delete('bad-l')).rejects.toThrow(NotFoundError);
      expect(mockLeaseRepo.delete).not.toHaveBeenCalled();
    });
  });
});
