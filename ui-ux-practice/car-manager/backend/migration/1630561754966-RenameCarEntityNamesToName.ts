import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameCarEntityNamesToName1630561754966
  implements MigrationInterface
{
  name = 'RenameCarEntityNamesToName1630561754966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."car" DROP COLUMN "names"`);
    await queryRunner.query(
      `ALTER TABLE "public"."car" DROP COLUMN "testColumn"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."car" ADD "name" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."car" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "public"."car" ADD "testColumn" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."car" ADD "names" character varying NOT NULL`,
    );
  }
}
