import { Injectable } from '@nestjs/common';
import { ResourcePermissionType } from '@prisma/client';
import prisma from 'src/prisma';

export namespace ResourceService {
  export type ResourceType = 'project';

  export type GetOneParams<K extends ResourceType> = {
    userId: string;
    resourceId: string;
    resourceType: K;
  };

  export type UpdateOneParams<K extends ResourceType> = GetOneParams<K> & {
    data: Parameters<(typeof prisma)[K]['update']>[0]['data'];
  };

  export type DeleteOneParams<K extends ResourceType> = GetOneParams<K>;
}

// @todo get rid of "as any"
@Injectable()
export class ResourceService {
  private async hasPermission<K extends ResourceService.ResourceType>(
    params: ResourceService.GetOneParams<K>,
    type: ResourcePermissionType,
  ) {
    const permission = await prisma.resourcePermission.findUnique({
      where: {
        resourceId_resourceType_userId: {
          userId: params.userId,
          resourceId: params.resourceId,
          resourceType: params.resourceType,
        },
      },
    });

    return permission && (permission.type.includes('Admin') || permission.type.includes(type));
  }

  async getOne<K extends ResourceService.ResourceType>(params: ResourceService.GetOneParams<K>) {
    if (!(await this.hasPermission(params, 'Read'))) {
      return null;
    }

    return await (prisma[params.resourceType] as any).findUnique({
      where: { id: params.resourceId },
    });
  }

  async updateOne<K extends ResourceService.ResourceType>(params: ResourceService.UpdateOneParams<K>) {
    if (!(await this.hasPermission(params, 'Write'))) {
      return null;
    }

    return await (prisma[params.resourceType] as any).update({
      where: { id: params.resourceId },
      data: params.data,
    });
  }

  async deleteOne<K extends ResourceService.ResourceType>(params: ResourceService.UpdateOneParams<K>) {
    if (!(await this.hasPermission(params, 'Delete'))) {
      return null;
    }

    return await (prisma[params.resourceType] as any).delete({ where: { id: params.resourceId } });
  }
}
