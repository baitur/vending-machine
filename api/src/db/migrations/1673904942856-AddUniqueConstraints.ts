import { MigrationInterface, QueryRunner, TableIndex, TableUnique } from 'typeorm';

export class AddUniqueConstraints1673904942856 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex('users', new TableIndex({
      columnNames: ['email'],
      isUnique: true
    }));

    await queryRunner.createIndex('users', new TableIndex({
      columnNames: ['username'],
      isUnique: true
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', new TableIndex({
      columnNames: ['email'],
      isUnique: true
    }));

    await queryRunner.dropIndex('users', new TableIndex({
      columnNames: ['username'],
      isUnique: true
    }));
  }

}
