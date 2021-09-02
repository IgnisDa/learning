import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1630513817781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE user(id INT NOT NULL, PRIMARY KEY);');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE user;');
  }
}
