import { Column, Entity, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export default class ActiveSession {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ type: 'text', nullable: false })
  token!: string;

  @Column({ type: 'text' })
  userId!: string;

  @Column({ type: 'date', default: () => new Date() })
  date?: Date;
}