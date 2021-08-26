import { createUnionType, ObjectType } from '@nestjs/graphql';
import { UserDto } from './user.dto';

@ObjectType({
  description: 'Type returned for the errors when a new user is created',
})
export class CreateUserError {
  /* The error associated with username */
  usernameError?: string;

  /* The error associated with email */
  emailError?: string;

  /* The error associated with password */
  passwordError?: string;
}

export const CreateUserResultUnion = createUnionType({
  name: 'CreateUserResultUnion',
  types: () => [CreateUserError, UserDto],
  description: 'Result type returned as the result when new user is created',
});
