import { Column, Entity, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export default class Role {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ type: 'text', nullable: false })
  name!: string;

  @Column({ type: 'date', default: () => new Date() })
  date?: Date;
}