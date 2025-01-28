import { HttpException, HttpStatus } from '@nestjs/common';

const errors = {
  'resource.forbidden': HttpStatus.FORBIDDEN,
};

export namespace ApplicationError {
  export type Code = keyof typeof errors;
}

export class ApplicationError extends HttpException {
  public readonly code: ApplicationError.Code;

  constructor(params: { code: ApplicationError.Code; message?: string }) {
    super(params.message || params.code, errors[params.code]);
    this.code = params.code;
  }
}
