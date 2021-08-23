import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  /* The primary key of the user */
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* The name of the user */
  @Field()
  @Column({ unique: true })
  username: string;

  /* The email of the user */
  @Field()
  @Column('text', { unique: true })
  email: string;

  /* The password of the user */
  @Field()
  @Column()
  password?: string;
}
