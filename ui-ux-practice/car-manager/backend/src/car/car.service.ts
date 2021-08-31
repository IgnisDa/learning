import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CarPicture } from './entities/car-picture.entity';
import { CreateCarInput } from './dto/create-car.input';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { v4 as uuid4 } from 'uuid';

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

  async addOne(createCarDto: CreateCarInput) {
    const car = this.carRepository.create(createCarDto);
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

  async addCarPicture(carId: number, file: FileUpload) {
    const car = await this.carRepository.findOne({ id: carId });
    if (!car) return false;
    const slug = uuid4();
    const name = file.filename;
    const resp = file
      .createReadStream()
      .pipe(createWriteStream(`media/uploads/${slug}-${name}`))
      .on('finish', () => true)
      .on('error', () => false);
    if (!resp) return false;
    const carPicture = this.carPictureRepository.create({ car, name, slug });
    await this.carPictureRepository.save(carPicture);
    return true;
  }
}
