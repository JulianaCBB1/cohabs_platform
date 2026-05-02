import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Room } from './Room';

@Entity('houses')
export class House {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Room, (room) => room.house, { cascade: true })
  rooms: Room[];
}
