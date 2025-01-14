import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateDomainTable1736765235368 implements MigrationInterface {
  name = 'CreateDomainTable1736765235368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the domains table
    await queryRunner.createTable(
      new Table({
        name: 'domains',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'domain',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
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
          {
            name: 'universityId',
            type: 'bigint',
            isNullable: true,
          },
        ],
      }),
      true, // `ifNotExists` flag to prevent errors if the table already exists
    );

    // Create a foreign key for universityId referencing universities(id)
    await queryRunner.createForeignKey(
      'domains',
      new TableForeignKey({
        columnNames: ['universityId'],
        referencedTableName: 'universities',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create a unique index for the domain column
    await queryRunner.createIndex(
      'domains',
      new TableIndex({
        name: 'IDX_5346af016e911f3008ce7aa9a2',
        columnNames: ['domain'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key on universityId
    const foreignKey = (await queryRunner.getTable('domains'))?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('universityId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('domains', foreignKey);
    }

    // Drop the unique index on domain
    await queryRunner.dropIndex('domains', 'IDX_5346af016e911f3008ce7aa9a2');

    // Drop the domains table
    await queryRunner.dropTable('domains', true); // `ifExists` flag to prevent errors if the table doesn't exist
  }
}
