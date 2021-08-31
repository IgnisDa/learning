import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { CarService } from './car.service';
import { CarResolver } from './car.resolver';
import { CarPicture } from './entities/car-picture.entity';
import { CarOrigin } from './entities/car-origin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, CarPicture, CarOrigin])],
  providers: [CarService, CarResolver],
  controllers: [],
})
export class CarModule {}
