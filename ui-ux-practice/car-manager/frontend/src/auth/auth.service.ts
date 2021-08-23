import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginResult } from './dto/login-result.dto';
import { LoginUserInput } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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

  async validateUserByPassword(loginAttempt: LoginUserInput) {
    // This will be used for the initial login
    let userToAttempt: User;
    if (loginAttempt.username) {
      userToAttempt = await this.userService.getUserByUsername(
        loginAttempt.username,
      );
    }
    if (!userToAttempt) return undefined;

    // Check the supplied password against the hash stored for this email address
    let isMatch = false;
    try {
      isMatch = await userToAttempt.checkPassword(loginAttempt.password);
    } catch (error) {
      return undefined;
    }

    if (isMatch) {
      // If there is a successful match, generate a JWT for the user
      const token = this.createJwt(userToAttempt).token;
      const result: LoginResult = {
        user: userToAttempt,
        token,
      };
      return result;
    }

    return undefined;
  }

  createJwt(user: User): { data: JwtPayload; token: string } {
    const data: JwtPayload = {
      id: user.id,
      username: user.username,
    };

    const jwt = this.jwtService.sign(data);

    return {
      data,
      token: jwt,
    };
  }
}
