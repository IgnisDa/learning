import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CarInput {
  @Field()
  name: string;
  @Field(() => Int)
  year: number;
  @Field()
  model: string;
}
