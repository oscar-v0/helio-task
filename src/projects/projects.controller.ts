import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { UserPrincipal } from '../auth/UserPrincipal';
import { CommonDto } from '../dto/CommonDto';
import { ProjectDto } from '../dto/ProjectDto';
import { ApplicationError } from '../utils/ApplicationError';
import { Validation } from '../utils/Validation';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly userPrincipal: UserPrincipal,
  ) {}

  @Get('/')
  getMany() {
    return this.projectService.getMany({ userId: this.userPrincipal.id });
  }

  @Get('/:id')
  async getOne(@Param() params: CommonDto.IdParams) {
    await Validation.validate(CommonDto.IdParams, params);
    return this.projectService.getOne({ id: params.id, userId: this.userPrincipal.id }).then(ApplicationError.notFoundIfNull);
  }

  @Post('/create')
  async create(@Body() project: ProjectDto.CreateParams) {
    await Validation.validate(ProjectDto.CreateParams, project);

    return this.projectService.createWithResourcePermission({
      userId: this.userPrincipal.id,
      permission: ['Admin'],
      data: {
        name: project.name,
        description: project.description,
        priority: project.priority,
        tags: project.tags,
        status: 'Active',
        Company: { connect: { id: this.userPrincipal.companyId } },
      },
    });
  }

  @Patch('/update/:id')
  async update(@Param() params: CommonDto.IdParams, @Body() project: ProjectDto.CreateParams) {
    await Validation.validate(CommonDto.IdParams, params);
    await Validation.validate(ProjectDto.CreateParams, project);

    return this.projectService.update({
      id: params.id,
      userId: this.userPrincipal.id,
      data: {
        name: project.name,
        description: project.description,
        priority: project.priority,
        tags: project.tags,
      },
    });
  }

  @HttpCode(204)
  @Delete('/delete/:id')
  async delete(@Param() params: CommonDto.IdParams) {
    await Validation.validate(CommonDto.IdParams, params);

    await this.projectService.delete({
      id: params.id,
      userId: this.userPrincipal.id,
    });
  }
}
