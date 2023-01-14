import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1673722659586 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        { name: 'first_name', type: 'varchar', length: '191' },
        { name: 'last_name', type: 'varchar', length: '191' },
        { name: 'username', type: 'varchar', length: '191' },
        { name: 'email', type: 'varchar', length: '191' },
        { name: 'password', type: 'varchar', length: '191' },
        {
          name: 'role',
          type: 'enum',
          enum: ['admin', 'buyer', 'seller'],
          enumName: 'roleEnum',
          default: '"buyer"',
        },
        { name: 'deposit', type: 'bigint' },
        { name: 'deleted_at', type: 'datetime', isNullable: true, default: null },
      ],
    });

    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }

}
