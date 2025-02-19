import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBattleUserCharacterTables31739807521334 implements MigrationInterface {
    name = 'CreateBattleUserCharacterTables31739807521334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "battle"
            ADD "round" integer NOT NULL DEFAULT '1'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "battle" DROP COLUMN "round"
        `);
    }

}
