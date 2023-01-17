import { Service } from 'typedi';
import { JWTProvider } from './Providers/JWTProvider';
import { LoggedUserInterface } from '@api/Interfaces/LoggedUserInterface';
import { UserRole } from '@api/models/User';

@Service()
export class AuthService {
  private provider: JWTProvider;

  public constructor() {
    this.provider = new JWTProvider();
  }

  public sign(payload: { role: UserRole; deposit: number; userId: number; email: string; username: string }, dataReturn: object): object {
    return this.provider.sign(payload, dataReturn);
  }
}
