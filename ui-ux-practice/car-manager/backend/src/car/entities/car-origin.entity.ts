import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CarOrigin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
