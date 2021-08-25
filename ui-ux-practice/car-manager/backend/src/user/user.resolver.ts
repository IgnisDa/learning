import { HttpException, HttpStatus } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserCreateInput } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('userCreateInput') userCreateInput: UserCreateInput) {
    const resp = await this.userService.createUser(userCreateInput);
    if (!resp.status) throw new HttpException(resp.resp, HttpStatus.CONFLICT);
    return resp.resp;
  }
}
