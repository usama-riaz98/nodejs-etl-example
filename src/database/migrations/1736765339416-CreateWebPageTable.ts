import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateWebPageTable1736765339416 implements MigrationInterface {
  name = 'CreateWebPageTable1736765339416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the web_pages table
    await queryRunner.createTable(
      new Table({
        name: 'web_pages',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'url',
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
      'web_pages',
      new TableForeignKey({
        columnNames: ['universityId'],
        referencedTableName: 'universities',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create a unique index for the url column
    await queryRunner.createIndex(
      'web_pages',
      new TableIndex({
        name: 'IDX_819c40ef9f7cde65745ba3fbbe',
        columnNames: ['url'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key on universityId
    const foreignKey = (await queryRunner.getTable('web_pages'))?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('universityId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('web_pages', foreignKey);
    }

    // Drop the unique index on url
    await queryRunner.dropIndex('web_pages', 'IDX_819c40ef9f7cde65745ba3fbbe');

    // Drop the web_pages table
    await queryRunner.dropTable('web_pages', true); // `ifExists` flag to prevent errors if the table doesn't exist
  }
}
