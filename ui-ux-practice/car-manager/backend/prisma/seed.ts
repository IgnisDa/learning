import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as faker from 'faker';

const prisma = new PrismaClient();

function randomElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getNullOrData(data: unknown) {
  if (Math.random() < 0.8) return data;
  return null;
}

async function seed() {
  const originCountries = [];
  for (let i = 0; i < 100; i++) {
    originCountries.push({
      name: `${faker.address.country()}__${randomUUID()}`,
    });
  }
  await prisma.carOrigin.createMany({
    data: originCountries,
  });
  const carOrigins = await prisma.carOrigin.findMany({ select: { id: true } });
  const cars = [];
  for (let i = 0; i < 1000; i++) {
    cars.push({
      milesPerGallon: getNullOrData(faker.datatype.float({ min: 10, max: 30 })),
      cylinders: getNullOrData(faker.datatype.number({ min: 2, max: 8 })),
      displacement: getNullOrData(faker.datatype.float({ min: 200, max: 500 })),
      horsepower: getNullOrData(faker.datatype.number({ min: 100, max: 1500 })),
      weight: getNullOrData(faker.datatype.float({ min: 300, max: 1500 })),
      acceleration: faker.datatype.float({ min: 2, max: 12 }),
      year: faker.datatype.number({ min: 1900, max: 2020 }),
      model: getNullOrData(faker.vehicle.model()),
      name: faker.vehicle.vehicle(),
      originCountryId: randomElement(carOrigins).id,
    });
  }
  await prisma.car.createMany({ data: cars });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
