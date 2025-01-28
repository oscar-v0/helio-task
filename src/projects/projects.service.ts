import { Injectable } from '@nestjs/common';
import { ResourceService } from 'src/resource/resource.service';

export namespace ProjectsService {
  export type GetOneParams = {
    id: string;
    userId: string;
  };
}

@Injectable()
export class ProjectsService {
  constructor(private readonly resourceService: ResourceService) {}

  async getOneProject(params: ProjectsService.GetOneParams) {
    return await this.resourceService.getOne({
      userId: params.userId,
      resourceId: params.id,
      resourceType: 'project',
    });
  }
}
