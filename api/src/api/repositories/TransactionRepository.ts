import { EntityRepository, IsNull } from 'typeorm';
import { MainRepository } from 'typeorm-simple-query-parser/lib';
import { Transaction } from '@api/models/Transaction';

@EntityRepository(Transaction)
export class TransactionRepository extends MainRepository<Transaction> {
  async getOneById(id: number): Promise<Transaction> {
    return this.findOne({ where: { deletedAt: IsNull(), id } });
  }

  async createTransaction(product: Transaction): Promise<Transaction> {
    return this.save(product);
  }

  async updateTransaction(id: number, product: Transaction): Promise<void> {
    await this.update(id, product);
  }

  async softDeleteTransaction(id: number): Promise<void> {
    await this.update(id, { deletedAt: new Date() });
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.delete(id);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.find({ where: { deletedAt: IsNull() } });
  }
}
