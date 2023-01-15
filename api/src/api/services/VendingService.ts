import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '@api/repositories/UserRepository';
import { ProductRepository } from '@api/repositories/ProductRepository';
import { DepositRequest } from '@api/Interfaces/DepositRequest';
import { LoggedUserInterface } from '@api/Interfaces/LoggedUserInterface';
import { BuyRequest } from '@api/Interfaces/BuyRequest';
import { HttpError } from 'routing-controllers';

@Service()
export class VendingService {
  constructor(
    @InjectRepository() private userRepository: UserRepository,
    @InjectRepository() private productRepository: ProductRepository,
  ) {
  }

  public async deposit(data: DepositRequest, loggedUser: LoggedUserInterface): Promise<number> {
    const user = await this.userRepository.getOneById(loggedUser.userId);
    user.deposit += data.coin;
    await this.userRepository.updateUser(loggedUser.userId, user);

    return user.deposit;
  }

  public async reset(loggedUser: LoggedUserInterface) {
    const user = await this.userRepository.getOneById(loggedUser.userId);
    const balance = user.deposit;
    user.deposit = 0;
    await this.userRepository.updateUser(loggedUser.userId, user);

    return this.convertToCoins(balance);
  }

  public async buy(data: BuyRequest, loggedUser: LoggedUserInterface) {
    let product = await this.productRepository.getOneById(data.productId);
    if (!product || product.deletedAt) {
      throw new HttpError(404, 'Not Found');
    }

    const user = await this.userRepository.getOneById(loggedUser.userId);
    const balance = user.deposit;
    if (balance < product.cost * data.amount) {
      throw new HttpError(500, 'User has not enough balance');
    }

    if (product.amountAvailable < data.amount) {
      throw new HttpError(500, 'There are not enough amount of product');
    }

    const change = user.deposit - product.cost * data.amount;

    // Set deposit to 0 and return change
    user.deposit = 0;
    await this.userRepository.updateUser(loggedUser.userId, user);

    // Decrease stock amount for the product
    product.amountAvailable -= data.amount;
    await this.productRepository.updateProduct(data.productId, product);

    return this.convertToCoins(change);
  }

  private convertToCoins(balance: number): number[] {
    let money = balance;
    return [100, 50, 20, 10, 5].map(coin => {
      const coins = Math.floor(money / coin);
      money = money % coin;
      return coins;
    }).reverse();
  }
}
