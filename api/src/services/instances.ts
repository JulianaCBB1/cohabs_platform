import { AppDataSource } from '../data-source';
import { House } from '../entities/House';
import { Room } from '../entities/Room';
import { User } from '../entities/User';
import { Lease } from '../entities/Lease';
import { HouseService } from './houseService';
import { RoomService } from './roomService';
import { UserService } from './userService';
import { LeaseService } from './leaseService';

export let userService: UserService;
export let houseService: HouseService;
export let roomService: RoomService;
export let leaseService: LeaseService;

export const initializeServices = () => {
  const userRepo = AppDataSource.getRepository(User);
  userService = new UserService(userRepo);

  const houseRepo = AppDataSource.getRepository(House);
  houseService = new HouseService(houseRepo);

  const roomRepo = AppDataSource.getRepository(Room);
  roomService = new RoomService(roomRepo);

  const leaseRepo = AppDataSource.getRepository(Lease);
  leaseService = new LeaseService(leaseRepo);
};
