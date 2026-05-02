import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoomTable1777733525364 implements MigrationInterface {
    name = 'CreateRoomTable1777733525364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roomNumber" character varying NOT NULL, "rentalPrice" numeric(10,2) NOT NULL, "stripeProductId" character varying, "stripePriceId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "houseId" uuid, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a932b719fa2fcb37d02ba2b0d4" ON "rooms" ("houseId") `);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_a932b719fa2fcb37d02ba2b0d43" FOREIGN KEY ("houseId") REFERENCES "houses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_a932b719fa2fcb37d02ba2b0d43"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a932b719fa2fcb37d02ba2b0d4"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
    }

}
