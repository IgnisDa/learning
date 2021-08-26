import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { checkPropertiesExists } from 'src/utils';
import { CreateUserError } from './dto/create-user.result';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userCreateInput: CreateUserInput) {
    const errors: CreateUserError = {
      usernameError: null,
      emailError: null,
      passwordError: null,
    };
    const resp = { status: false, resp: null };
    const usernameExists = await this.userRepository.find({
      where: {
        username: Like(userCreateInput.username),
      },
    });
    if (usernameExists.length !== 0) {
      errors.usernameError = 'This user already exists';
    }
    const emailExists = await this.userRepository.find({
      where: {
        email: Like(userCreateInput.email),
      },
    });
    if (emailExists.length !== 0) {
      errors.emailError = 'This email already exists';
    }
    if (!checkPropertiesExists(Object(errors))) {
      resp.resp = errors;
      return resp;
    }
    const newUser = new UserEntity();
    newUser.email = userCreateInput.email;
    newUser.password = userCreateInput.password;
    newUser.username = userCreateInput.username;
    resp.status = true;
    resp.resp = await this.userRepository.save(newUser);
    return resp;
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOne({ username });
  }
}
