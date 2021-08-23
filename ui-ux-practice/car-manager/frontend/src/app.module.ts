import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModule } from './car/car.module';
import { join } from 'path/posix';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        JWT_SECRET: Joi.string()
          .required()
          .error(new Error('Create a .env file with a `JWT_SECRET` key')),
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: `${process.env.DATABASE_URL}/car_db`,
      database: 'car_db',
      autoLoadEntities: true,
      logging: process.env.NODE_ENV === 'development',
      synchronize: process.env.NODE_ENV === 'development',
      migrations: ['migration/*.js'],
      cli: {
        migrationsDir: 'migration',
      },
    }),
    CarModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
