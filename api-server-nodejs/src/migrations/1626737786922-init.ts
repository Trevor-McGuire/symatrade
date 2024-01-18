import {MigrationInterface, QueryRunner} from "typeorm";

export class init1626737786922 implements MigrationInterface {
    name = 'init1626737786922'

    public async up(queryRunner: QueryRunner): Promise<void> {
      const roleRepository = queryRunner.connection.getMongoRepository('Role');
      await roleRepository.insertMany([
          { id: 1, name: 'admin' },
          { id: 2, name: 'user' },
          { id: 3, name: 'guest' }
      ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const roleRepository = queryRunner.connection.getMongoRepository('Role');
    await roleRepository.deleteMany({});
}

}
