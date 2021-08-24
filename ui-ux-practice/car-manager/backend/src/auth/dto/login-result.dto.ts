import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class LoginResult {
  /* The user this login result is associated with */
  @Field()
  user: User;

  /* The JWT token to be used for authentication */
  @Field()
  token: string;
}
