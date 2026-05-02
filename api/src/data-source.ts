import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { House } from './entities/House';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL as string,
  entities: [User, House],
  migrations: [path.join(__dirname, 'migrations', '*.ts')],
  synchronize: false,
  logging: false,
});
