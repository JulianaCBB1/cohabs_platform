import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { UserService } from './userService';

export let userService: UserService;

export const initializeServices = () => {
  const userRepo = AppDataSource.getRepository(User);
  userService = new UserService(userRepo);
};
