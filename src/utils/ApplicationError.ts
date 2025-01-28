import { HttpException, HttpStatus } from '@nestjs/common';

const errors = {
  'error.notFound': HttpStatus.NOT_FOUND,
  'error.badRequest': HttpStatus.BAD_REQUEST,
  'auth.unauthorized': HttpStatus.UNAUTHORIZED,
  'resource.forbidden': HttpStatus.FORBIDDEN,
};

export namespace ApplicationError {
  export type Code = keyof typeof errors;
}

export class ApplicationError extends HttpException {
  public readonly code: ApplicationError.Code;

  static notFoundIfNull<T>(v: T) {
    if (!v) throw new ApplicationError({ code: 'error.notFound' });
    return v as NonNullable<T>;
  }

  constructor(params: { code: ApplicationError.Code; message?: string }) {
    super(params.message || params.code, errors[params.code]);
    this.code = params.code;
  }
}
