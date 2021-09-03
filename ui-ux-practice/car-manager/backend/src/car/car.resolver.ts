import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CarService } from './car.service';
import { CarDto } from './dto/car.dto';
import { CarNotFoundError, CarResultUnion } from './dto/car.result';
import { CreateCarInput } from './dto/create-car.input';
import { FileUpload } from 'graphql-upload';
import { GraphQLUpload } from 'apollo-server-express';

@Resolver('Car')
export class CarResolver {
  constructor(private carService: CarService) {}

  @Query(() => CarResultUnion, { description: 'Find a car with the given ID' })
  async car(@Args('id', { type: () => Int }) id: number) {
    const resp = await this.carService.findOne(id);
    if (!resp) {
      return {
        __typename: CarNotFoundError.name,
        message: 'Car was not found',
      };
    }
    return {
      __typename: CarDto.name,
      ...resp,
    };
  }

  @Query(() => [CarDto], { description: 'Get a list of all cars' })
  async cars() {
    const resp = await this.carService.findAll();
    return resp;
  }

  @Mutation(() => CarDto, {
    description:
      'Create a car with the given values and insert it into the database',
  })
  async createCar(@Args('carInput') createCarDto: CreateCarInput) {
    return await this.carService.addOne(createCarDto);
  }

  @Mutation(() => Boolean, { description: 'Add a car picture for a given car' })
  async addCarPicture(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
    @Args('id', { type: () => Int }) carId: number,
  ) {
    return await this.carService.addCarPicture(carId, file);
  }
}
