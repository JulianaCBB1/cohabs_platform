/// <reference types="jest" />
import { UserService } from '../userService';
import { Repository } from 'typeorm';
import { User } from '../../entities/User';
import bcrypt from 'bcrypt';
import * as jwtUtils from '../../utils/jwt';
import { ConflictError, ForbiddenError } from '../../utils/errors';

jest.mock('bcrypt');
jest.mock('../../utils/jwt');

const mockedBcrypt = jest.mocked(bcrypt);
const mockedJwt = jest.mocked(jwtUtils);

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepo: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    mockUserRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    userService = new UserService(mockUserRepo);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictError if email already exists', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: '1' } as User);

      await expect(
        userService.register('test@test.com', 'password123')
      ).rejects.toThrow(ConflictError);

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('should hash password and save user on success', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashed_password' as never);

      mockUserRepo.create.mockReturnValue({
        email: 'test@test.com',
        passwordHash: 'hashed_password',
      } as User);

      mockUserRepo.save.mockResolvedValue({
        id: 'uuid',
        email: 'test@test.com',
      } as User);

      const result = await userService.register('test@test.com', 'password123');

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepo.save).toHaveBeenCalled();
      expect(result.email).toBe('test@test.com');
    });
  });

  describe('login', () => {
    it('should throw ForbiddenError if user is not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(userService.login('wrong@test.com', 'pass')).rejects.toThrow(
        ForbiddenError
      );
    });

    it('should return a token and user details on valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        passwordHash: 'hashed',
        role: 'user',
      } as User;

      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.signToken.mockReturnValue('mock_token');

      const result = await userService.login('test@test.com', 'password123');

      expect(result).toEqual({
        token: 'mock_token',
        user: { id: '1', email: 'test@test.com', role: 'user' },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashed'
      );
    });

    it('should throw ForbiddenError if password check fails', async () => {
      mockUserRepo.findOne.mockResolvedValue({
        passwordHash: 'hashed',
      } as User);

      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        userService.login('test@test.com', 'wrong_pass')
      ).rejects.toThrow(ForbiddenError);
    });
  });
});
