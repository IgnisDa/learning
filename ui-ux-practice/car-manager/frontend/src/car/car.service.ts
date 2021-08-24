import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CarInput } from './dto/create-car.dto';
import { CarPictureInput } from './dto/create-car-picture.dto';
import { CarPicture } from './entities/car-picture.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private carRepository: Repository<Car>,
    @InjectRepository(CarPicture)
    private carPictureRepository: Repository<CarPicture>,
  ) {}

  async findAll() {
    const resp = await this.carRepository.find();
    return resp;
  }

  async addOne(createCarDto: CarInput) {
    const car = new Car();
    car.model = createCarDto.model;
    car.name = createCarDto.name;
    car.year = createCarDto.year;
    return await this.carRepository.save(car);
  }

  async findOne(id: number) {
    return await this.carRepository.findOne(id);
  }

  async remove(id: number) {
    return await this.carRepository.delete(id);
  }

  async deleteAllCars() {
    const entities = await this.carRepository.find();
    await this.carRepository.remove(entities);
    return true;
  }

  async addCarPicture(carId: number, carPictureDto: CarPictureInput) {
    const car = await this.carRepository.findOne({ id: carId });
    if (!car) return false;
    const carPicture = new CarPicture();
    carPicture.car = car;
    carPicture.url = carPictureDto.url;
    await this.carPictureRepository.save(carPicture);
    car.carPictures.push(carPicture);
    return true;
  }
}
