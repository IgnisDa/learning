import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CarOrigin } from './car-origin.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float8', { nullable: true })
  milesPerGallon?: number;

  @Column({ nullable: true })
  cylinders?: number;

  @Column('float8', { nullable: true })
  displacement?: number;

  @Column({ nullable: true })
  horsepower?: number;

  @Column('float8', { comment: 'The weight of the car in KGs', nullable: true })
  weight?: number;

  @Column('float8', { nullable: true })
  acceleration: number;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  model?: string;

  @ManyToOne(() => CarOrigin, { onDelete: 'SET NULL', nullable: true })
  originCountry?: CarOrigin;
}
