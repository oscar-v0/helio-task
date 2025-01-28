import { Injectable } from '@nestjs/common';
import { ResourcePermissionType } from '@prisma/client';
import prisma from 'src/prisma';
import { ApplicationError } from 'src/utils/ApplicationError';
import { firstCharUpperCase } from 'src/utils/string';

export namespace ResourceService {
  export type ResourceType = 'project';

  export type GetOneParams<K extends ResourceType> = {
    userId: string;
    resourceId: string;
    resourceType: K;
    where?: Omit<Parameters<(typeof prisma)[K]['findUnique']>[0]['where'], 'id'>;
  };

  export type UpdateOneParams<K extends ResourceType> = GetOneParams<K> & {
    data: Parameters<(typeof prisma)[K]['update']>[0]['data'];
  };

  export type DeleteOneParams<K extends ResourceType> = GetOneParams<K>;
}

// @todo get rid of "as any"
@Injectable()
export class ResourceService {
  async getMany<K extends ResourceService.ResourceType>(params: { resourceType: K }) {
    return (await prisma.resourcePermission.aggregateRaw({
      pipeline: [
        {
          $match: {
            type: { $in: ['Read', 'Admin'] },
          },
        },
        {
          $lookup: {
            from: firstCharUpperCase(params.resourceType),
            localField: 'resourceId',
            foreignField: '_id',
            as: 'resource',
          },
        },
        {
          $unwind: '$resource',
        },
        {
          $project: {
            _id: 0,
            resource: 1,
          },
        },
        {
          $replaceRoot: {
            newRoot: '$resource',
          },
        },
        {
          $project: {
            _id: 0,
            ...Object.fromEntries(
              Object.entries(prisma[params.resourceType].fields).map(([name, field]) => [
                name,
                field.typeName === 'String' ? { $toString: '$_id' } : 1,
              ]),
            ),
          },
        },
      ],
    })) as ReturnType<(typeof prisma)[K]['findMany']>;
  }

  async getOne<K extends ResourceService.ResourceType>(params: ResourceService.GetOneParams<K>) {
    await this.requirePermission(params, 'Read');

    return await (prisma[params.resourceType] as any).findUnique({
      where: {
        id: params.resourceId,
        ...params.where,
      },
    });
  }

  async updateOne<K extends ResourceService.ResourceType>(params: ResourceService.UpdateOneParams<K>) {
    await this.requirePermission(params, 'Write');

    return await (prisma[params.resourceType] as any).update({
      where: {
        ...params.where,
        id: params.resourceId,
      },
      data: params.data,
    });
  }

  async deleteOne<K extends ResourceService.ResourceType>(params: ResourceService.UpdateOneParams<K>) {
    await this.requirePermission(params, 'Delete');

    return await (prisma[params.resourceType] as any).delete({
      where: {
        id: params.resourceId,
        ...params.where,
      },
    });
  }

  private async requirePermission<K extends ResourceService.ResourceType>(
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

    if (!permission || !permission.type.includes('Admin') || !permission.type.includes(type)) {
      throw new ApplicationError({ code: 'resource.forbidden' });
    }
  }
}
