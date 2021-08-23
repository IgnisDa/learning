import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CarPictureInput {
  @Field()
  url: string;
}
