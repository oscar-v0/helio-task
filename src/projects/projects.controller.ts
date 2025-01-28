import { Controller, Get, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get('/')
  getMany() {
    return this.projectService.getMany();
  }

  @Get('/one')
  getOne(@Query('id') id: string) {
    return this.projectService.getOne({ id, userId: '6798ef6a2b7b801acc439f02' });
  }
}
