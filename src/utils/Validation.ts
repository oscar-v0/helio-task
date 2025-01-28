import { validate } from '@nestjs/class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ApplicationError } from './ApplicationError';

export class Validation {
  static async validate<T extends object>(cls: ClassConstructor<T>, value: any) {
    const instance = plainToInstance(cls, value);
    const errors = await validate(instance, { whitelist: true });

    if (errors.length > 0) {
      throw new ApplicationError({ code: 'error.badRequest', message: Object.entries(errors[0].constraints)[0].join(': ') });
    }

    return instance;
  }
}
