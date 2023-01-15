import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpError,
  JsonController,
  Param,
  Post,
  Put,
  UseBefore,
} from 'routing-controllers';
import { Service } from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { ProductService } from '@api/services/ProductService';
import { LoggedUser } from '@api/decorators/LoggedUser';
import { AuthUserControlLevel } from '@api/middlewares/AuthUserControlLevel';
import { LoggedUserInterface } from '@api/Interfaces/LoggedUserInterface';
import { ProductCreateRequest } from '@api/Interfaces/ProductCreateRequest';
import { ProductUpdateRequest } from '@api/Interfaces/ProductUpdateRequest';
import { UserRole } from '@api/models/User';
import { BuyerControlLevel } from '@api/middlewares/BuyerControlLevel';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/products')
export class ProductController {
  public constructor(private productService: ProductService) {
  }

  @UseBefore(AuthUserControlLevel)
  @Get()
  public async getAll() {
    return await this.productService.getAll();
  }

  @UseBefore(AuthUserControlLevel)
  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number) {
    return await this.productService.findOneById(id);
  }

  @UseBefore(BuyerControlLevel)
  @Get('/my')
  public async getAllMyProducts(@LoggedUser() loggedUser: LoggedUserInterface) {
    return await this.productService.getAllMyProducts(loggedUser.userId);
  }

  @UseBefore(BuyerControlLevel)
  @Post()
  @HttpCode(201)
  public async create(@Body() product: ProductCreateRequest, @LoggedUser() loggedUser: LoggedUserInterface) {
    return await this.productService.create(product, loggedUser);
  }

  @UseBefore(BuyerControlLevel)
  @Put('/:id')
  public async update(@Param('id') id: number, @Body() product: ProductUpdateRequest, @LoggedUser() loggedUser: LoggedUserInterface) {
    await this.checkProductOwner(id, loggedUser);
    return await this.productService.updateOneById(id, product);
  }

  @UseBefore(BuyerControlLevel)
  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number, @LoggedUser() loggedUser: LoggedUserInterface) {
    await this.checkProductOwner(id, loggedUser);
    await this.productService.deleteOneById(id);
    return {};
  }

  private async checkProductOwner(id: number, loggedUser: LoggedUserInterface) {
    const product = await this.productService.findOneById(id);
    if (loggedUser.role != UserRole.BUYER || product.ownerId != loggedUser.userId) {
      throw new HttpError(403, 'Forbidden');
    }
  }
}

