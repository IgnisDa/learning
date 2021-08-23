import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { VerifyAuthInput } from './dto/verify-auth.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      return null;
    }
    const passwordValid = password === user.password;
    return passwordValid ? user : null;
  }

  login(user: User): { access_token: string } {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verify(token: string) {
    const decoded: User = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.userService.getUserByUsername(decoded.email);
    if (!user) {
      throw new Error('Unable to get user from the decoded token');
    }
    return user;
  }
}
