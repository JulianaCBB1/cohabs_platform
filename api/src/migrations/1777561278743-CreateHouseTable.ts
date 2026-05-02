import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHouseTable1777561278743 implements MigrationInterface {
    name = 'CreateHouseTable1777561278743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "houses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee6cacb502a4b8590005eb3dc8d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "houses"`);
    }

}
