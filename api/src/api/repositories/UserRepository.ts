import { EntityRepository, IsNull, UpdateResult } from 'typeorm';
import { User } from '@api/models/User';
import { MainRepository } from 'typeorm-simple-query-parser/lib';

@EntityRepository(User)
export class UserRepository extends MainRepository<User> {
  async getOneById(id: number): Promise<User> {
    return this.findOne({ where: { deletedAt: IsNull(), id } });
  }

  async createUser(user: User): Promise<User> {
    return this.save(user);
  }

  async updateUser(id: number, user: User): Promise<UpdateResult> {
    return await this.update(id, user);
  }

  async softDeleteUser(id: number): Promise<void> {
    await this.update(id, { deletedAt: new Date() });
  }

  async deleteUser(id: number): Promise<void> {
    await this.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.find({ where: { deletedAt: IsNull() } });
  }
}
