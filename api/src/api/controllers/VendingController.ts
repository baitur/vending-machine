import { Body, Get, JsonController, Post, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { VendingService } from '@api/services/VendingService';
import { DepositRequest } from '@api/Interfaces/DepositRequest';
import { LoggedUser } from '@api/decorators/LoggedUser';
import { LoggedUserInterface } from '@api/Interfaces/LoggedUserInterface';
import { BuyerControlLevel } from '@api/middlewares/BuyerControlLevel';
import { BuyRequest } from '@api/Interfaces/BuyRequest';

@Service()
@OpenAPI({
  tags: ['Vending'],
})
@JsonController()
export class VendingController {
  public constructor(private vendingService: VendingService) {
  }

  @UseBefore(BuyerControlLevel)
  @Post('/deposit')
  public async deposit(@Body() depositRequest: DepositRequest, @LoggedUser() loggedUser: LoggedUserInterface) {
    const balance = await this.vendingService.deposit(depositRequest, loggedUser);
    return { balance };
  }

  @UseBefore(BuyerControlLevel)
  @Get('/reset')
  public async reset(@LoggedUser() loggedUser: LoggedUserInterface) {
    const balance = await this.vendingService.reset(loggedUser);
    return { balance };
  }

  @UseBefore(BuyerControlLevel)
  @Post('/buy')
  public async buy(@Body() buyRequest: BuyRequest, @LoggedUser() loggedUser: LoggedUserInterface) {
    const change = await this.vendingService.buy(buyRequest, loggedUser);
    return { change };
  }
}
