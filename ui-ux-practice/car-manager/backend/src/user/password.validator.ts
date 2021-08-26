import { registerDecorator, ValidationOptions } from 'class-validator';
import * as zxcvbn from 'zxcvbn';

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
