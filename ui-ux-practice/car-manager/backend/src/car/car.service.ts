import { Injectable } from '@nestjs/common';
import { CreateCarInput } from './dto/create-car.input';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { v4 as uuid4 } from 'uuid';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const resp = await this.prisma.car.findMany();
    return resp;
  }

  async addOne(createCarDto: CreateCarInput) {
    return await this.prisma.car.create({ data: createCarDto });
  }

  async findOne(id: number) {
    return await this.prisma.car.findUnique({ where: { id } });
  }

  async remove(id: number) {
    return await this.prisma.car.delete({ where: { id } });
  }

  async addCarPicture(carId: number, file: FileUpload) {
    try {
      const slug = uuid4();
      const name = file.filename;
      const resp = file
        .createReadStream()
        .pipe(createWriteStream(`media/uploads/${slug}-${name}`))
        .on('finish', () => true)
        .on('error', () => false);
      if (!resp) return false;
      await this.prisma.car.update({
        where: { id: carId },
        data: {
          car_picture: {
            create: {
              name,
              slug,
            },
          },
        },
      });
      return true;
    } catch {
      // normally exception occurs when the carID does not exist in the database
      return false;
    }
  }
}
