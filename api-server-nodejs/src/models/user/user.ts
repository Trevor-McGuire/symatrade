import { Column, Entity, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export default class User {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ type: 'text', nullable: false })
  username!: string;

  @Column({ type: 'text', nullable: false })
  email!: string;

  @Column({ type: 'text', nullable: false })
  password!: string;

  @Column({ type: 'date', default: () => new Date() })
  date?: Date;

  @Column({ type: 'text' }) // specify the type here
  loginMethod!: ObjectId;

  @Column({ type: 'text' }) // specify the type here
  role!: ObjectId;
}