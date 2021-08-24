import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VerifyAuthInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
