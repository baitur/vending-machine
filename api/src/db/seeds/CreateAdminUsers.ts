import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';
import { User, UserRole } from '@api/models/User';

export default class CreateAdminUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userData = {
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      email: 'admin@vending-machine-api.com',
      password: 'password',
      role: UserRole.ADMIN,
    };

    const repository = connection.getRepository(User);
    const user = await repository
      .findOne({ where: { email: userData.email } });
    if (!user) {
      const models = await repository
        .create(userData);

      await repository.save(models);
    }
  }
}
