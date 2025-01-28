import { validate } from '@nestjs/class-validator';
import { plainToInstance } from 'class-transformer';
import { ApplicationError } from './ApplicationError';

export class Validation {
  static async validate(cls, value) {
    const e = await validate(plainToInstance(cls, value));

    if (e.length > 0) {
      throw new ApplicationError({ code: 'error.badRequest', message: Object.entries(e[0].constraints)[0].join(': ') });
    }
  }
}
