import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from '@nestjs/class-validator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserPrincipal } from 'src/auth/UserPrincipal';
import { Validation } from 'src/utils/Validation';
import { ProjectsService } from './projects.service';

export namespace Dto {
  export class CreateParams {
    @MinLength(1)
    @MaxLength(30)
    @IsNotEmpty()
    @IsString()
    name: string;

    @MinLength(0)
    @MaxLength(200)
    @IsOptional()
    @IsString()
    description?: string;

    @Min(1)
    @Max(3)
    @IsOptional()
    @IsNumber()
    priority?: number;

    @ArrayMinSize(0)
    @ArrayMaxSize(10)
    @IsArray()
    tags?: string[];
  }
}

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

  @Post('/create')
  async create(@Body() project: Dto.CreateParams) {
    await Validation.validate(Dto.CreateParams, project);

    return this.projectService.createAndGrantAccess({
      userId: this.userPrincipal.id,
      permission: ['Admin'],
      project: {
        name: project.name,
        description: project.description,
        priority: project.priority,
        tags: project.tags,
        status: 'Active',
        Company: { connect: { id: this.userPrincipal.companyId } },
      },
    });
  }
}
