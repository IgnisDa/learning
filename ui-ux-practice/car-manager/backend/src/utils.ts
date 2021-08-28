import { ValidationError } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';
import * as zxcvbn from 'zxcvbn';

export function checkPropertiesExists(obj: Record<string, unknown>) {
  for (const key in obj) {
    if (obj[key] !== null && obj[key] != '') return false;
  }
  return true;
}

export function extendObject(...objects: any) {
  return Object.assign({}, ...objects);
}

export async function validateObject(obj: any, transformToType: any) {
  const transformedObj = plainToClass(transformToType, obj);
  const validationErrors: ValidationError[] = await validate(transformedObj);
  const errors = validationErrors.map((v) => {
    const error = {};
    error[`${v.property}Errors`] = Object.values(v.constraints);
    return error;
  });
  return extendObject(...errors);
}

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            this.error = 'Empty password';
            return false;
          }
          const result = zxcvbn(value);
          if (result.score === 0) {
            this.error = 'Password is too weak';
            return false;
          }
          return true;
        },
        defaultMessage(): string {
          return this.error || 'Something went wrong';
        },
      },
    });
  };
}
