import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserResultUnion } from './dto/create-user.result';
import { CreateUserInput } from './dto/create-user.input';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => CreateUserResultUnion)
  async createUser(@Args('userCreateInput') userCreateInput: CreateUserInput) {
    const resp = await this.userService.createUser(userCreateInput);
    if (!resp.status) {
      return {
        __typename: 'CreateUserError',
        ...resp.resp,
      };
    }
    return {
      __typename: 'UserDto',
      ...resp.resp,
    };
  }
}
