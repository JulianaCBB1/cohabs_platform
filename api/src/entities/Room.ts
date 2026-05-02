import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { House } from './House';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  rentalPrice: number;

  @Column({ nullable: true })
  stripeProductId: string;

  @Column({ nullable: true })
  stripePriceId: string;

  @Index()
  @ManyToOne(() => House, (house) => house.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'houseId' })
  house: House;

  @CreateDateColumn()
  createdAt: Date;
}
