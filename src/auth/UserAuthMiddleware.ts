import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/prisma';
import { ApplicationError } from 'src/utils/ApplicationError';
import { UserPrincipal } from './UserPrincipal';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  constructor(private readonly userPrincipal: UserPrincipal) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('authorization');

    if (authorization) {
      const parts = authorization.split(' ');

      if (parts.length === 2 && parts[0] === 'Bearer') {
        const id = parts[1];

        const user = await prisma.user.findUnique({ where: { id } }).catch((e) => {
          if (e.code !== 'P2023') throw e;
          return null;
        });

        if (user) {
          (req as any).auth = { userId: user.id };
          next();
          return;
        }
      }
    }

    throw new ApplicationError({ code: 'auth.unauthorized' });
  }
}
