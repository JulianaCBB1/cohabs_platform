import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLeasesTable1777738275222 implements MigrationInterface {
    name = 'CreateLeasesTable1777738275222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "leases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" date NOT NULL, "endDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "roomId" uuid, CONSTRAINT "PK_2668e338ab2d27079170ea55ea2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "leases" ADD CONSTRAINT "FK_87ac29b7297cf58cedf663a9dea" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leases" ADD CONSTRAINT "FK_431e74d7fba742e33fe82009e83" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leases" DROP CONSTRAINT "FK_431e74d7fba742e33fe82009e83"`);
        await queryRunner.query(`ALTER TABLE "leases" DROP CONSTRAINT "FK_87ac29b7297cf58cedf663a9dea"`);
        await queryRunner.query(`DROP TABLE "leases"`);
    }

}
