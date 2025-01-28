import { Controller, Get, Query } from '@nestjs/common';
import { UserPrincipal } from 'src/auth/UserPrincipal';
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

  @Get('/one')
  getOne(@Query('id') id: string) {
    return this.projectService.getOne({ id, userId: this.userPrincipal.id });
  }
}
