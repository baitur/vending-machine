import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ProductRepository } from '@api/repositories/ProductRepository';
import { HttpError } from 'routing-controllers';
import { ProductCreateRequest } from '@api/Interfaces/ProductCreateRequest';
import { Product } from '@api/models/Product';
import { ProductUpdateRequest } from '@api/Interfaces/ProductUpdateRequest';
import { LoggedUserInterface } from '@api/Interfaces/LoggedUserInterface';

@Service()
export class ProductService {
  constructor(
    @InjectRepository() private productRepository: ProductRepository,
  ) {
  }

  public async getAll() {
    return await this.productRepository.getAllProducts();
  }

  public async getAllMyProducts(userId: number) {
    return await this.productRepository.getAllMyProducts(userId);
  }

  public async findOneById(id: number) {
    return await this.getRequestedProductOrFail(id);
  }

  public async create(data: ProductCreateRequest, loggedUser?: LoggedUserInterface) {
    const productData: Product = Object.assign(new Product(), data);
    productData.ownerId = loggedUser.userId;
    return await this.productRepository.createProduct(productData);
  }

  public async updateOneById(id: number, data: ProductUpdateRequest) {
    const product = await this.getRequestedProductOrFail(id);
    const productData: Product = Object.assign(product, data);
    await this.productRepository.updateProduct(id, productData);

    return productData;
  }

  public async deleteOneById(id: number) {
    return await this.productRepository.softDeleteProduct(id);
  }

  private async getRequestedProductOrFail(id: number) {
    let product = await this.productRepository.getOneById(id);

    if (!product) {
      throw new HttpError(404, 'Not Found');
    }

    return product;
  }
}
