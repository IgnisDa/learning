import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateInput } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(userCreateInput: UserCreateInput) {
    const newUser = new User();
    newUser.email = userCreateInput.email;
    newUser.password = userCreateInput.password;
    newUser.username = userCreateInput.username;
    return await this.userRepository.save(newUser);
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOne({ username });
  }
}
