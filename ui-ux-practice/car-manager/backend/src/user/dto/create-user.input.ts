import { InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsPasswordValid } from '../password.validator';

@InputType({ description: 'Type to use while creating a new user' })
export class CreateUserInput {
  /* The username of the new user */
  @IsNotEmpty()
  username: string;

  /* The email of the new user */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /* The password of the new user */
  @IsNotEmpty()
  @IsPasswordValid()
  @MinLength(10)
  password: string;
}
