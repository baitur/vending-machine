import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTransactionsTable1673734155662 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'transactions',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        { name: 'buyer_id', type: 'bigint' },
        { name: 'product_id', type: 'bigint' },
        { name: 'cost', type: 'bigint' },
        { name: 'amount', type: 'bigint' },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'datetime', isNullable: true, default: null },
      ],
    });
    await queryRunner.createTable(table);

    await queryRunner.createForeignKeys(
      'transactions',
      [
        new TableForeignKey({
          columnNames: ['product_id'],
          referencedTableName: 'products',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          columnNames: ['buyer_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys(
      'transactions',
      [
        new TableForeignKey({
          columnNames: ['product_id'],
          referencedTableName: 'products',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          columnNames: ['buyer_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }),
      ],
    );
    await queryRunner.dropTable('transactions');
  }

}
