import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableDuration1681140805791 implements MigrationInterface {
    name = 'NullableDuration1681140805791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduled_event" ALTER COLUMN "duration" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduled_event" ALTER COLUMN "duration" SET NOT NULL`);
    }

}
