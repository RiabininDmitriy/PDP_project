import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1740659574685 implements MigrationInterface {
    name = 'InitialMigration1740659574685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "character" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "classType" "public"."character_classtype_enum" NOT NULL,
                "hp" integer NOT NULL DEFAULT '100',
                "normalAttack" integer NOT NULL DEFAULT '10',
                "heavyAttack" integer NOT NULL DEFAULT '20',
                "defense" integer NOT NULL DEFAULT '5',
                "money" integer NOT NULL DEFAULT '0',
                "level" integer NOT NULL DEFAULT '1',
                "gearScore" integer NOT NULL DEFAULT '0',
                "xp" integer NOT NULL DEFAULT '0',
                "imageUrl" character varying NOT NULL DEFAULT '',
                "userId" uuid,
                CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "password" character varying NOT NULL,
                "username" character varying NOT NULL,
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "battle_log" (
                "id" SERIAL NOT NULL,
                "damage" integer NOT NULL,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                "round" integer NOT NULL DEFAULT '1',
                "attackerName" character varying,
                "defenderName" character varying,
                "attackerHp" integer,
                "defenderHp" integer,
                "battleId" uuid,
                "attackerId" uuid,
                "defenderId" uuid,
                CONSTRAINT "PK_627270b772c0e1700b39655684b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "battle" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "battleCreatorId" uuid,
                "playerOneHp" integer NOT NULL DEFAULT '0',
                "playerTwoHp" integer NOT NULL DEFAULT '0',
                "winnerId" character varying,
                "winnerName" character varying,
                "playerOneId" uuid,
                "playerTwoId" uuid,
                CONSTRAINT "PK_995fe4fbf64982dd97e7c59e760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "character"
            ADD CONSTRAINT "FK_04c2fb52adfa5265763de8c4464" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "battle_log"
            ADD CONSTRAINT "FK_1a695b94e63a2a9b78e5ad861e0" FOREIGN KEY ("battleId") REFERENCES "battle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "battle_log"
            ADD CONSTRAINT "FK_1c1c5437d61181dc7b848af0e46" FOREIGN KEY ("attackerId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "battle_log"
            ADD CONSTRAINT "FK_f06561b5ccf01e429aa29379716" FOREIGN KEY ("defenderId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "battle"
            ADD CONSTRAINT "FK_907cadb722106a2c07dc5c65cd1" FOREIGN KEY ("battleCreatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "battle"
            ADD CONSTRAINT "FK_f553bc611812aaf5bd2b4527b96" FOREIGN KEY ("playerOneId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "battle"
            ADD CONSTRAINT "FK_1e022f87786d53d2df150825c49" FOREIGN KEY ("playerTwoId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "battle" DROP CONSTRAINT "FK_1e022f87786d53d2df150825c49"
        `);
        await queryRunner.query(`
            ALTER TABLE "battle" DROP CONSTRAINT "FK_f553bc611812aaf5bd2b4527b96"
        `);
        await queryRunner.query(`
            ALTER TABLE "battle" DROP CONSTRAINT "FK_907cadb722106a2c07dc5c65cd1"
        `);
        await queryRunner.query(`
            ALTER TABLE "battle_log" DROP CONSTRAINT "FK_f06561b5ccf01e429aa29379716"
        `);
        await queryRunner.query(`
            ALTER TABLE "battle_log" DROP CONSTRAINT "FK_1c1c5437d61181dc7b848af0e46"
        `);
        await queryRunner.query(`
            ALTER TABLE "battle_log" DROP CONSTRAINT "FK_1a695b94e63a2a9b78e5ad861e0"
        `);
        await queryRunner.query(`
            ALTER TABLE "character" DROP CONSTRAINT "FK_04c2fb52adfa5265763de8c4464"
        `);
        await queryRunner.query(`
            DROP TABLE "battle"
        `);
        await queryRunner.query(`
            DROP TABLE "battle_log"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "character"
        `);
    }

}
