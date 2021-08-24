import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { LoginUserInput } from './dto/login-user.dto';
import { AuthenticationError } from 'apollo-server-core';
import { LoginResult } from './dto/login-result.dto';
import { CurrentUser } from './current-user.decorator';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => LoginResult)
  async login(@Args('user') user: LoginUserInput) {
    const res = await this.authService.validateUserByPassword(user);
    if (res) return res;
    throw new AuthenticationError(
      'Could not log-in with the provided credentials',
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  async refreshToken(@CurrentUser() user: User) {
    if (!user)
      throw new AuthenticationError(
        'Could not log in with the provided credentials',
      );
    const result = this.authService.createJwt(user);
    if (result) return result.token;
    throw new AuthenticationError(
      'Could not log in with the provided credentials',
    );
  }
}
