import { MigrationInterface, QueryRunner } from 'typeorm'

export class addProductEntity1599339859285 implements MigrationInterface {
  name = 'addProductEntity1599339859285'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "seoDescription" varchar NOT NULL, "seoKeywords" varchar NOT NULL, "seoText" varchar NOT NULL, "seoTitle" varchar NOT NULL, "isDeleted" boolean NOT NULL)`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`, undefined)
    await queryRunner.query(`DROP TABLE "product"`, undefined)
  }
}
