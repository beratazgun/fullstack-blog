// import { registerDecorator, ValidationArguments } from 'class-validator';

// export function IsStringOrNull() {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       name: 'IsStringOrNull',
//       target: object.constructor,
//       propertyName: propertyName,
//       validator: {
// validate(value: string, args: ValidationArguments) {
//   if (value === null || typeof value === 'string') {
//     return true;
//   }

//   console.log(args);

//   return false;
// },
// },
//     });
//   };
// }

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStringOrNull(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsStringOrNull',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        ...validationOptions,
        message: `Value of \`${propertyName}\` should be a string or null.`,
      },
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (value === null || typeof value === 'string') {
            return true;
          }

          return false;
        },
      },
    });
  };
}
