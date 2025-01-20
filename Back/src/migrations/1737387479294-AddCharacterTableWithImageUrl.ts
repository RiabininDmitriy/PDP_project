import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCharacterTableWithImageUrl1737387479294 implements MigrationInterface {
    name = 'AddCharacterTableWithImageUrl1737387479294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "character"
            ADD "imageUrl" character varying NOT NULL DEFAULT ''
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "character" DROP COLUMN "imageUrl"
        `);
    }

}
