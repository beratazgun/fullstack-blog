import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { zxcvbnAsync, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

export function IsPasswordStrong(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsPasswordStrong',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [
        {
          message: (constraints: ValidationArguments['constraints']) => {
            return constraints;
          },
        },
      ],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          if (!value) {
            return false;
          }

          zxcvbnOptions.setOptions({
            translations: zxcvbnEnPackage.translations,
            graphs: zxcvbnCommonPackage.adjacencyGraphs,
            dictionary: {
              ...zxcvbnCommonPackage.dictionary,
              ...zxcvbnEnPackage.dictionary,
            },
          });

          const { score, feedback } = await zxcvbnAsync(value);

          if (score < 3) {
            args.constraints[0] = (
              feedback.warning ?? '' + ' ' + feedback.suggestions[0]
            ).trim();
            return false;
          } else {
            return true;
          }
        },
      },
    });
  };
}
