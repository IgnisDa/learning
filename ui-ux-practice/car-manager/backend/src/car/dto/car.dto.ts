import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { CarOriginDto } from './car-origin.dto';

@ObjectType({ description: 'A car instance that is stored in the database' })
export class CarDto {
  @Field(() => ID, { description: 'The unique ID of the car' })
  id: number;

  /* The name of the car */
  name: string;

  /* Miles that can be driven per gallon of fuel */
  milesPerGallon?: string;

  @Field(() => Int, { description: 'The number of cylinders' })
  cylinders?: number;

  @Field(() => Float, { description: 'The displacement of the car' })
  displacement?: number;

  @Field(() => Int, { description: 'The horsepower delivered by the car' })
  horsepower?: number;

  @Field(() => Float, { description: 'The weight of the car in KGs' })
  weight?: number;

  @Field(() => Float, {
    description: 'The highest acceleration that can be achieved by the car',
  })
  acceleration?: number;

  @Field(() => Int, { description: 'The year the car was released in' })
  year: number;

  /* The name of the car model */
  model?: string;

  @Field(() => CarOriginDto, {
    description: 'The place where this car originates from',
  })
  originCountry?: CarOriginDto;
}
