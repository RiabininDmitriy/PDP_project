import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToUserName1736440998314 implements MigrationInterface {
	name = 'AddIndexToUserName1736440998314';

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"
        `);
	}

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username")
        `);
	}
}
