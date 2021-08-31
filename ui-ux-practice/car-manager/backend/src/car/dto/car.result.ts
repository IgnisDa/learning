import { createUnionType, ObjectType } from '@nestjs/graphql';
import { APIError } from 'src/auth/dto/api-error.interface';
import { CarDto } from './car.dto';

@ObjectType({
  description:
    'The type returned for the errors when getting a car is unsuccessful',
  implements: () => APIError,
})
export class CarNotFoundError extends APIError {
  /* The error message */
  message: string;
}

export const CarResultUnion = createUnionType({
  name: 'CarResultUnion',
  types: () => [CarNotFoundError, CarDto],
  description:
    'Result type returned as the result when someone tries to find a car',
});
