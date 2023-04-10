import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1681139294892 implements MigrationInterface {
    name = 'Init1681139294892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "media" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "length" integer NOT NULL, CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduled_event" ("id" SERIAL NOT NULL, "startTime" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "mediaId" integer, "epgId" integer, CONSTRAINT "PK_59a1f1e0d902729bdfe3d02c089" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "epg" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_296489a9023fa744df37903bc49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "scheduled_event" ADD CONSTRAINT "FK_2e2aa13d6a52e17a8a485f15fed" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduled_event" ADD CONSTRAINT "FK_6310956a819fd38f15f69509a68" FOREIGN KEY ("epgId") REFERENCES "epg"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduled_event" DROP CONSTRAINT "FK_6310956a819fd38f15f69509a68"`);
        await queryRunner.query(`ALTER TABLE "scheduled_event" DROP CONSTRAINT "FK_2e2aa13d6a52e17a8a485f15fed"`);
        await queryRunner.query(`DROP TABLE "epg"`);
        await queryRunner.query(`DROP TABLE "scheduled_event"`);
        await queryRunner.query(`DROP TABLE "media"`);
    }

}
