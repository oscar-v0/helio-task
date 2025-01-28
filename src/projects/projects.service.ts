import { Injectable } from '@nestjs/common';
import { Prisma, ResourcePermissionType } from '@prisma/client';
import prisma from 'src/prisma';
import { ResourceService } from 'src/resource/resource.service';

export namespace ProjectsServiceDto {
  export class CreateWithPermissionParams {
    userId: string;
    project: Prisma.ProjectCreateInput;
    permission: ResourcePermissionType[];
  }
}
export namespace ProjectsService {
  export type GetOneParams = {
    id: string;
    userId: string;
  };

  export type GetManyParams = {
    userId: string;
  };

  export type CreateParams = {
    name: string;
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

  async createAndGrantAccess(params: ProjectsServiceDto.CreateWithPermissionParams) {
    const project = await prisma.project.create({ data: params.project });

    await this.resourceService.createOrUpdatePermission({
      type: params.permission,
      userId: params.userId,
      resourceId: project.id,
      resourceType: 'project',
    });

    return project;
  }
}
