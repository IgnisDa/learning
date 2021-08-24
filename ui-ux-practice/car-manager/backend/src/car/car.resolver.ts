import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Car } from './entities/car.entity';
import { CarService } from './car.service';
import { CarInput } from './dto/create-car.dto';
import { HttpException } from '@nestjs/common';
import { CarPictureInput } from './dto/create-car-picture.dto';

@Resolver(() => Car)
export class CarResolver {
  constructor(private carService: CarService) {}

  @Query(() => Car)
  async car(@Args('id', { type: () => Int }) id: number) {
    const resp = await this.carService.findOne(id);
    if (!resp) throw new HttpException('Not Found', 404);
    return resp;
  }

  @Query(() => [Car])
  async cars() {
    const resp = await this.carService.findAll();
    return resp;
  }

  @Mutation(() => Boolean)
  async deleteAllCars() {
    const resp = await this.carService.deleteAllCars();
    return resp;
  }

  @Mutation(() => Car)
  async createCar(@Args('carInput') createCarDto: CarInput) {
    return await this.carService.addOne(createCarDto);
  }

  @Mutation(() => Boolean)
  async addCarPicture(
    @Args('id', { type: () => Int }) carId: number,
    @Args('carPictureInput') carPictureDto: CarPictureInput,
  ) {
    return await this.carService.addCarPicture(carId, carPictureDto);
  }
}
