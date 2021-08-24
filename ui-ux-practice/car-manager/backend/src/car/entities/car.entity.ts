import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { CarPicture } from './car-picture.entity';

@ObjectType()
@Entity()
export class Car {
  @AfterLoad()
  async nullChecks() {
    if (!this.carPictures) {
      this.carPictures = [];
    }
  }

  /* The primary key of the car */
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  /* The name of the car */
  @Column({ unique: true })
  name: string;

  /* The year the car was first launched */
  @Column()
  year: number;

  /* The model/version of the car's make */
  @Column()
  model?: string;

  /* The photos of this car */
  @Field(() => [CarPicture])
  @OneToMany(() => CarPicture, (carPicture) => carPicture.car, {
    eager: true,
  })
  carPictures: CarPicture[];
}
