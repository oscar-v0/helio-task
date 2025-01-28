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
    const { id } = await Validation.validate(CommonDto.IdParams, params);
    return this.projectService.getOne({ id, userId: this.userPrincipal.id }).then(ApplicationError.notFoundIfNull);
  }

  @Post('/create')
  async create(@Body() project: ProjectDto.CreateParams) {
    return this.projectService.createWithResourcePermission({
      userId: this.userPrincipal.id,
      permission: ['Admin'],
      data: {
        ...(await Validation.validate(ProjectDto.CreateParams, project)),
        status: 'Active',
        Company: { connect: { id: this.userPrincipal.companyId } },
      },
    });
  }

  @Patch('/update/:id')
  async update(@Param() params: CommonDto.IdParams, @Body() project: ProjectDto.CreateParams) {
    const { id } = await Validation.validate(CommonDto.IdParams, params);

    return this.projectService.update({
      id,
      userId: this.userPrincipal.id,
      data: await Validation.validate(ProjectDto.CreateParams, project),
    });
  }

  @HttpCode(204)
  @Delete('/delete/:id')
  async delete(@Param() params: CommonDto.IdParams) {
    const { id } = await Validation.validate(CommonDto.IdParams, params);
    await this.projectService.delete({ id, userId: this.userPrincipal.id });
  }
}
