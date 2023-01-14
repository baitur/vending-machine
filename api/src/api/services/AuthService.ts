import { Service } from 'typedi';
import { JWTProvider } from './Providers/JWTProvider';
import { LoggedUserInterface } from '@api/Interfaces/LoggedUserInterface';

@Service()
export class AuthService {
  private provider: JWTProvider;

  public constructor() {
    this.provider = new JWTProvider();
  }

  public sign(payload: LoggedUserInterface, dataReturn: object): object {
    return this.provider.sign(payload, dataReturn);
  }
}
