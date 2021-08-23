import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Car } from './car.entity';

@ObjectType()
@Entity()
export class CarPicture {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Car)
  @ManyToOne(() => Car, (car) => car.carPictures, {
    onDelete: 'CASCADE',
  })
  car: Car;

  @Field()
  @Column()
  url: string;
}
