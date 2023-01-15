import { EntityRepository, IsNull } from 'typeorm';
import { MainRepository } from 'typeorm-simple-query-parser/lib';
import { Product } from '@api/models/Product';

@EntityRepository(Product)
export class ProductRepository extends MainRepository<Product> {
  async getOneById(id: number): Promise<Product> {
    return this.findOne({ where: { deletedAt: IsNull(), id } });
  }

  async createProduct(product: Product): Promise<Product> {
    return this.save(product);
  }

  async updateProduct(id: number, product: Product): Promise<void> {
    await this.update(id, product);
  }

  async softDeleteProduct(id: number): Promise<void> {
    await this.update(id, { deletedAt: new Date() });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.delete(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.find({ where: { deletedAt: IsNull() } });
  }

  async getAllMyProducts(ownerId: number): Promise<Product[]> {
    return this.find({ where: { deletedAt: IsNull(), ownerId } });
  }
}
