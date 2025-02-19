import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBattleLogTable1739812892813 implements MigrationInterface {
    name = 'UpdateBattleLogTable1739812892813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "battle_log"
            ADD "attackerName" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "battle_log"
            ADD "defenderName" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "battle_log" DROP COLUMN "defenderName"
        `);
        await queryRunner.query(`
            ALTER TABLE "battle_log" DROP COLUMN "attackerName"
        `);
    }

}
