import {
  Get,
  Controller,
  Param,
  HttpException,
  Body,
  Delete,
  Post,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CarInput } from './dto/create-car.dto';

@Controller('car')
export class CarController {
  constructor(private carService: CarService) {}

  @Get()
  getAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  async getOne(@Param() id: number) {
    const car = await this.carService.findOne(id);
    if (!car) {
      throw new HttpException('Not Found', 404);
    }
    return car;
  }

  @Post()
  async addOne(@Body() createCarDto: CarInput) {
    const car = await this.carService.addOne(createCarDto);
    return car;
  }

  @Delete(':id')
  async deleteOne(@Param() id: number) {
    const cars = await this.carService.remove(id);
    if (cars.affected === 0) {
      throw new HttpException('Not Found', 404);
    }
  }
}
