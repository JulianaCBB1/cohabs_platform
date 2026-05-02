import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { signToken } from '../utils/jwt';
import { ConflictError, ForbiddenError, NotFoundError } from '../utils/errors';

export class UserService {
  constructor(private userRepo: Repository<User>) {}

  async register(email: string, password: string): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictError('Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, passwordHash });

    return await this.userRepo.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new ForbiddenError('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new ForbiddenError('Invalid credentials');

    const token = signToken(user);

    return {
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async getById(id: string) {
    const room = await this.userRepo.findOne({
      where: { id },
    });
    if (!room) throw new NotFoundError(`User ${id} not found`);
    return room;
  }
}
