import { Injectable } from '@nestjs/common';
import prisma from 'src/prisma';

@Injectable()
export class UsersService {
  constructor() {}

  async getOne(params: { id: string }) {
    return await prisma.user.findUnique({ where: { id: params.id } });
  }

  create() {}

  update() {}
}
