import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError } from 'src/utils/ApplicationError';

@Injectable()
export class UserPrincipal {
  constructor(@Inject('REQUEST') private readonly req: Request) {}

  get id() {
    // @todo fix as any
    const id = (this.req as any).auth?.userId;

    if (!id) {
      throw new ApplicationError({ code: 'auth.unauthorized' });
    }

    return id;
  }
}
