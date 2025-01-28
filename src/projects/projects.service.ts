import { Injectable } from '@nestjs/common';
import { Prisma, ResourcePermissionType } from '@prisma/client';
import prisma from '../prisma';
import { ResourceService } from '../resource/resource.service';

export namespace ProjectsService {
  export type GetOneParams = {
    id: string;
    userId: string;
  };

  export type DeleteOneParams = {
    id: string;
    userId: string;
  };

  export type GetManyParams = {
    userId: string;
  };

  export type CreateParams = {
    name: string;
  };

  export type CreateWithPermissionParams = {
    userId: string;
    permission: ResourcePermissionType[];
    data: Prisma.ProjectCreateInput;
  };

  export type UpdateParams = {
    id: string;
    userId: string;
    data: Prisma.ProjectUpdateInput;
  };
}

@Injectable()
export class ProjectsService {
  constructor(private readonly resourceService: ResourceService) {}

  async getMany({ userId }: ProjectsService.GetManyParams) {
    return this.resourceService.getMany({
      userId,
      resourceType: 'project',
    });
  }

  async getOne(params: ProjectsService.GetOneParams) {
    return await this.resourceService.getOne({
      userId: params.userId,
      resourceId: params.id,
      resourceType: 'project',
    });
  }

  async createWithResourcePermission(params: ProjectsService.CreateWithPermissionParams) {
    const project = await prisma.project.create({ data: params.data });

    await this.resourceService.createOrUpdatePermission({
      type: params.permission,
      userId: params.userId,
      resourceId: project.id,
      resourceType: 'project',
    });

    return project;
  }

  async update(params: ProjectsService.UpdateParams) {
    return await this.resourceService.updateOne({
      data: params.data,
      userId: params.userId,
      resourceType: 'project',
      resourceId: params.id,
    });
  }

  async delete(params: ProjectsService.GetOneParams) {
    return await this.resourceService.deleteOne({
      userId: params.userId,
      resourceId: params.id,
      resourceType: 'project',
    });
  }
}
