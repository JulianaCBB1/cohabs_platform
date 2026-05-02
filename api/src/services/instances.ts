import { AppDataSource } from '../data-source';
import { House } from '../entities/House';
import { User } from '../entities/User';
import { HouseService } from './houseService';
import { UserService } from './userService';

export let userService: UserService;
export let houseService: HouseService;

export const initializeServices = () => {
  const userRepo = AppDataSource.getRepository(User);
  userService = new UserService(userRepo);

  const houseRepo = AppDataSource.getRepository(House);
  houseService = new HouseService(houseRepo);
};
