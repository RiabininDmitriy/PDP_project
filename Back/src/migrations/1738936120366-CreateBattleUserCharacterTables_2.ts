import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBattleUserCharacterTables21738936120366 implements MigrationInterface {
    name = 'CreateBattleUserCharacterTables21738936120366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "battle"
            ADD "winnerName" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "battle" DROP COLUMN "winnerName"
        `);
    }

}
