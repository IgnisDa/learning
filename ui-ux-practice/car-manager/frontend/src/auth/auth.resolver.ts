import { Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from './current-user.decorator';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }
}
