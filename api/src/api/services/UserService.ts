import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '@api/repositories/UserRepository';
import { HttpError } from 'routing-controllers';
import { UserCreateRequest } from '@api/Interfaces/UserCreateRequest';
import { User, UserRole } from '@api/models/User';
import { UserUpdateRequest } from '@api/Interfaces/UserUpdateRequest';
import { LoggedUserInterface } from '@api/Interfaces/LoggedUserInterface';

@Service()
export class UserService {
  constructor(
    @InjectRepository() private userRepository: UserRepository,
  ) {
  }

  public async getAll() {
    return await this.userRepository.getAllUsers();
  }

  public async findOneById(id: number) {
    return await this.getRequestedUserOrFail(id);
  }

  public async create(data: UserCreateRequest, loggedUser?: LoggedUserInterface) {
    const userData: User = Object.assign(new User(), data);
    if (!loggedUser || (loggedUser && loggedUser.role != UserRole.ADMIN)) {
      userData.role = UserRole.BUYER;
    }
    return await this.userRepository.createUser(userData);
  }

  public async updateOneById(id: number, data: UserUpdateRequest) {
    const user = await this.getRequestedUserOrFail(id);
    const userData: User = Object.assign(user, data);
    await this.userRepository.updateUser(id, userData);

    return userData;
  }

  public async deleteOneById(id: number) {
    return await this.userRepository.softDeleteUser(id);
  }

  private async getRequestedUserOrFail(id: number) {
    let user = await this.userRepository.getOneById(id);

    if (!user) {
      throw new HttpError(404, 'Not Found');
    }

    return user;
  }
}
