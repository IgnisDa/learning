import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserCreateInput } from './dto/create-user.dto';
import { checkPropertiesExists } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(userCreateInput: UserCreateInput) {
    const errors = { username: null, email: null };
    const resp = { status: false, resp: null };
    const usernameExists = await this.userRepository.find({
      where: {
        username: Like(userCreateInput.username),
      },
    });
    if (usernameExists.length !== 0) {
      errors.username = 'This user already exists';
    }
    const emailExists = await this.userRepository.find({
      where: {
        email: Like(userCreateInput.email),
      },
    });
    if (emailExists.length !== 0) {
      errors.email = 'This email already exists';
    }
    if (!checkPropertiesExists(errors)) {
      resp.status = false;
      resp.resp = errors;
      return resp;
    }
    const newUser = new User();
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
