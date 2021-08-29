import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { checkPropertiesExists, mergeObjects, validateObject } from 'src/utils';
import { CreateUserError } from './dto/create-user.result';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    let errors = new CreateUserError();
    const validationErrors = plainToClass(
      CreateUserError,
      await validateObject(createUserInput, CreateUserInput),
    );
    const resp = { status: false, resp: null };
    const usernameExists = await this.userRepository.find({
      where: {
        username: Like(createUserInput.username),
      },
    });
    if (usernameExists.length !== 0) {
      errors.usernameErrors.push('this user already exists');
    }
    const emailExists = await this.userRepository.find({
      where: {
        email: Like(createUserInput.email),
      },
    });
    if (emailExists.length !== 0) {
      errors.emailErrors.push('this email already exists');
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'usernameErrors' does not exist on type '{}'.
    errors = mergeObjects(errors, ...validationErrors);
    if (!checkPropertiesExists(Object(errors))) {
      resp.resp = errors;
      return resp;
    }
    const newUser = new UserEntity();
    newUser.email = createUserInput.email;
    newUser.password = createUserInput.password;
    newUser.username = createUserInput.username;
    resp.status = true;
    resp.resp = await this.userRepository.save(newUser);
    return resp;
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOne({ username });
  }
}
