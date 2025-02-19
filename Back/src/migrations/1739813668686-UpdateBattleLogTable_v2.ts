import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBattleLogTableV21739813668686 implements MigrationInterface {
    name = 'UpdateBattleLogTableV21739813668686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "battle_log"
            ADD "attackerHp" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "battle_log"
            ADD "defenderHp" integer
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "battle_log" DROP COLUMN "defenderHp"
        `);
        await queryRunner.query(`
            ALTER TABLE "battle_log" DROP COLUMN "attackerHp"
        `);
    }

}
