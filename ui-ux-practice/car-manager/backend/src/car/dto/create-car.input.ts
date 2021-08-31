import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType({ description: 'A car instance that is stored in the database' })
export class CreateCarInput {
  /* The name of the car */
  name: string;

  @Field(() => Float, {
    description: 'Miles that can be driven per gallon of fuel',
  })
  milesPerGallon?: number;

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
  acceleration: number;

  @Field(() => Int, { description: 'The year the car was released in' })
  year: number;

  /* The name of the car model */
  model?: string;
}
