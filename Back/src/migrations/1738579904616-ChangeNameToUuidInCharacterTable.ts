import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNameToUuidInCharacterTable1738579904616 implements MigrationInterface {
    name = 'ChangeNameToUuidInCharacterTable1738579904616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "character" DROP CONSTRAINT "PK_6c4aec48c564968be15078b8ae5"
        `);
        await queryRunner.query(`
            ALTER TABLE "character" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "character"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "character"
            ADD CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "character" DROP CONSTRAINT "PK_6c4aec48c564968be15078b8ae5"
        `);
        await queryRunner.query(`
            ALTER TABLE "character" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "character"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "character"
            ADD CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id")
        `);
    }

}
