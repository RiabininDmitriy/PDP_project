import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCharacterTable1737114851641 implements MigrationInterface {
    name = 'AddCharacterTable1737114851641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."character_classtype_enum" AS ENUM('Warrior', 'Mage', 'Thief')
        `);
        await queryRunner.query(`
            CREATE TABLE "character" (
                "id" SERIAL NOT NULL,
                "classType" "public"."character_classtype_enum" NOT NULL,
                "hp" integer NOT NULL DEFAULT '100',
                "normalAttack" integer NOT NULL DEFAULT '10',
                "heavyAttack" integer NOT NULL DEFAULT '20',
                "defense" integer NOT NULL DEFAULT '5',
                "money" integer NOT NULL DEFAULT '0',
                "level" integer NOT NULL DEFAULT '1',
                "gearScore" integer NOT NULL DEFAULT '0',
                "userId" integer,
                CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "character"
            ADD CONSTRAINT "FK_04c2fb52adfa5265763de8c4464" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "character" DROP CONSTRAINT "FK_04c2fb52adfa5265763de8c4464"
        `);
        await queryRunner.query(`
            DROP TABLE "character"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."character_classtype_enum"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username")
        `);
    }

}
