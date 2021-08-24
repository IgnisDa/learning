import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  public async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
