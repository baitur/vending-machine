import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductsTable1673734144424 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'products',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        { name: 'product_name', type: 'varchar', length: '191' },
        { name: 'cost', type: 'bigint' },
        { name: 'amountAvailable', type: 'bigint' },
        { name: 'owner_id', type: 'bigint' },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'datetime', isNullable: true, default: null },
      ],
    });
    await queryRunner.createTable(table);

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.dropTable('products');
  }

}
