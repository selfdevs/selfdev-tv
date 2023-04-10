import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMediaName1681140048546 implements MigrationInterface {
    name = 'AddMediaName1681140048546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "name"`);
    }

}
