import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthenticationError } from 'apollo-server-core';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(validationPayload: JwtPayload) {
    const user = await this.userService.getUserByUsername(
      validationPayload.username,
    );
    if (!user) {
      throw new AuthenticationError(
        'Could not log in with the provided credentials',
      );
    }

    return user;
  }
}
