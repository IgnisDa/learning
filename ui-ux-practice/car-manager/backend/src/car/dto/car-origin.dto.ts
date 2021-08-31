import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'The place where a car has originated from' })
export class CarOriginDto {
  /* The name of the origin country */
  name: string;
}
