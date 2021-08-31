import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Car } from './car.entity';

@Entity()
export class CarPicture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @ManyToOne(() => Car, { onDelete: 'CASCADE' })
  car: Car;

  @Column()
  name: string;
}
