import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApplicationError } from 'src/utils/ApplicationError';

@Injectable()
export class UserPrincipal {
  constructor(@Inject('REQUEST') private readonly req: Request) {}

  private _get(): User {
    // @todo fix as any
    const user = (this.req as any).auth?.user;
    if (!user) throw new ApplicationError({ code: 'auth.unauthorized' });
    return user;
  }

  get id() {
    return this._get().id;
  }

  get companyId() {
    return this._get().companyId;
  }
}
