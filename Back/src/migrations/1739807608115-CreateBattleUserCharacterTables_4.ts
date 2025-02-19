import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBattleUserCharacterTables41739807608115 implements MigrationInterface {
    name = 'CreateBattleUserCharacterTables41739807608115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "battle" DROP COLUMN "round"
        `);
        await queryRunner.query(`
            ALTER TABLE "battle_log"
            ADD "round" integer NOT NULL DEFAULT '1'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "battle_log" DROP COLUMN "round"
        `);
        await queryRunner.query(`
            ALTER TABLE "battle"
            ADD "round" integer NOT NULL DEFAULT '1'
        `);
    }

}
