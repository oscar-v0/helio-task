import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/prisma';
import { ApplicationError } from 'src/utils/ApplicationError';

@Injectable()
export class CompaniesService {
  constructor() {}

  async getOne(params: { id: string }) {
    return await prisma.company.findUnique({ where: params });
  }

  async getMany(params?: Prisma.CompanyWhereInput) {
    return await prisma.company.findMany({ where: params });
  }

  async create(params: Parameters<typeof prisma.company.create>[0]) {
    return await prisma.company.create(params);
  }

  async update(params: Parameters<typeof prisma.company.update>[0]) {
    console.log(params);
    return await prisma.company.update(params).catch((e) => {
      if (e.code === 'P2025') throw new ApplicationError({ code: 'error.notFound' });
      throw e;
    });
  }

  async delete(params: { id: string }) {
    return await prisma.company.delete({ where: { id: params.id } }).catch((e) => {
      if (e.code === 'P2025') throw new ApplicationError({ code: 'error.notFound' });
      throw e;
    });
  }
}
