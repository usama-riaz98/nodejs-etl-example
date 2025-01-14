import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUniversityTable1736765186737 implements MigrationInterface {
  name = 'CreateUniversityTable1736765186737';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the universities table
    await queryRunner.createTable(
      new Table({
        name: 'universities',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '150',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'alphaTwoCode',
            type: 'varchar',
            length: '2',
            isNullable: false,
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'stateProvince',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP(6)',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
            isNullable: true,
          },
        ],
      }),
      true, // `ifNotExists` flag to prevent errors if the table already exists
    );

    // Create an additional index on the alphaTwoCode column
    await queryRunner.createIndex(
      'universities',
      new TableIndex({
        name: 'IDX_alphaTwoCode',
        columnNames: ['alphaTwoCode'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index on alphaTwoCode
    await queryRunner.dropIndex('universities', 'IDX_alphaTwoCode');

    // Drop the universities table
    await queryRunner.dropTable('universities', true); // `ifExists` flag to prevent errors if the table doesn't exist
  }
}
