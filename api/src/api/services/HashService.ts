import { Service } from 'typedi';
import { BcryptProvider } from './Providers/BcryptProvider';

@Service()
export class HashService {
  private provider: BcryptProvider;

  public constructor() {
    this.provider = new BcryptProvider();
  }

  public async make(data: any, saltOrRounds: string | number = 10) {
    return await this.provider.make(data, saltOrRounds);
  }

  public async compare(data: any, encrypted: string) {
    return await this.provider.compare(data, encrypted);
  }
}
