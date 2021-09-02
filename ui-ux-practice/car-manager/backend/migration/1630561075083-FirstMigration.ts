import {MigrationInterface, QueryRunner} from "typeorm";

export class FirstMigration1630561075083 implements MigrationInterface {
    name = 'FirstMigration1630561075083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "car_origin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_c02e5bea1252fdfdb73a7e277df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car" ("id" SERIAL NOT NULL, "names" character varying NOT NULL, "milesPerGallon" double precision, "cylinders" integer, "displacement" double precision, "horsepower" integer, "weight" double precision, "acceleration" double precision, "year" integer, "model" character varying, "originCountryId" uuid, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id")); COMMENT ON COLUMN "car"."weight" IS 'The weight of the car in KGs'`);
        await queryRunner.query(`CREATE TABLE "car_picture" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, "carId" integer, CONSTRAINT "PK_f655e4fad75fbbb4b1c1c23383d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_bae9c9affb18533416759d859e7" FOREIGN KEY ("originCountryId") REFERENCES "car_origin"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_picture" ADD CONSTRAINT "FK_c7c65bbb35e457fe5529f41e2f4" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_picture" DROP CONSTRAINT "FK_c7c65bbb35e457fe5529f41e2f4"`);
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_bae9c9affb18533416759d859e7"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "car_picture"`);
        await queryRunner.query(`DROP TABLE "car"`);
        await queryRunner.query(`DROP TABLE "car_origin"`);
    }

}
