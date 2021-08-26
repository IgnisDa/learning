import { InputType } from '@nestjs/graphql';

@InputType({ description: 'Type to use while creating a new user' })
export class CreateUserInput {
  /* The username of the new user */
  username: string;

  /* The email of the new user */
  email: string;

  /* The password of the new user */
  password: string;
}
