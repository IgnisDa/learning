import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { CarService } from './car.service';
import { CarResolver } from './car.resolver';
import { CarPicture } from './entities/car-picture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, CarPicture])],
  providers: [CarService, CarResolver],
  controllers: [],
})
export class CarModule {}
