import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AuthService } from '@api/services/AuthService';
import { HashService } from '@api/services/HashService';
import { HttpError } from 'routing-controllers';
import { LoginRequest } from '@api/Interfaces/LoginRequest';
import { UserRepository } from '@api/repositories/UserRepository';

@Service()
export class LoginService {
  constructor(
    @InjectRepository() private userRepository: UserRepository,
    private authService: AuthService,
    private hashService: HashService,
  ) {
  }

  public async login(data: LoginRequest) {
    let user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user || !(await this.hashService.compare(data.password, user.password))) {
      throw new HttpError(401, 'Unauthorized');
    }

    return this.authService.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      { user: { id: user.id, email: user.email, role: user.role, full_name: user.fullName } },
    );
  }
}
