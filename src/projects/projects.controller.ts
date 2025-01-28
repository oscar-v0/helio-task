import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from '@nestjs/class-validator';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { UserPrincipal } from 'src/auth/UserPrincipal';
import { ApplicationError } from 'src/utils/ApplicationError';
import { Validation } from 'src/utils/Validation';
import { ProjectsService } from './projects.service';

export namespace Dto {
  export class IdParams {
    @IsMongoId()
    id: string;
  }
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
    @IsOptional()
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

  @Get('/:id')
  async getOne(@Param() params: Dto.IdParams) {
    await Validation.validate(Dto.IdParams, params);
    return this.projectService.getOne({ id: params.id, userId: this.userPrincipal.id }).then(ApplicationError.notFoundIfNull);
  }

  @Post('/create')
  async create(@Body() project: Dto.CreateParams) {
    await Validation.validate(Dto.CreateParams, project);

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
  async update(@Param() params: Dto.IdParams, @Body() project: Dto.CreateParams) {
    await Validation.validate(Dto.IdParams, params);
    await Validation.validate(Dto.CreateParams, project);

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
  async delete(@Param() params: Dto.IdParams) {
    await Validation.validate(Dto.IdParams, params);

    await this.projectService.delete({
      id: params.id,
      userId: this.userPrincipal.id,
    });
  }
}
