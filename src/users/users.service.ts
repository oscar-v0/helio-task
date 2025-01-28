import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/prisma';
import { ApplicationError } from 'src/utils/ApplicationError';

@Injectable()
export class UsersService {
  constructor() {}

  async getOne(params: { id: string }) {
    return await prisma.user.findUnique({ where: params });
  }

  async getMany(params?: Prisma.UserWhereInput) {
    return await prisma.user.findMany({ where: params });
  }

  async create(params: Parameters<typeof prisma.user.create>[0]) {
    return await prisma.user.create(params);
  }

  async update(params: Parameters<typeof prisma.user.update>[0]) {
    return await prisma.user.update(params).catch((e) => {
      if (e.code === 'P2025') throw new ApplicationError({ code: 'error.notFound' });
      throw e;
    });
  }

  async delete(params: { id: string }) {
    // @todo resourcePermission deletion should be handled by ResourceService
    await prisma.resourcePermission.deleteMany({ where: { userId: params.id } });
    return await prisma.user.delete({ where: { id: params.id } }).catch((e) => {
      if (e.code === 'P2025') throw new ApplicationError({ code: 'error.notFound' });
      throw e;
    });
  }
}
