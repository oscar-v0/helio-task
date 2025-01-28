import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CommonDto } from '../dto/CommonDto';
import { UserDto } from '../dto/UserDto';
import { ApplicationError } from '../utils/ApplicationError';
import { Validation } from '../utils/Validation';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  getMany() {
    return this.usersService.getMany();
  }

  @Get('/:id')
  async getOne(@Param() params: CommonDto.IdParams) {
    return this.usersService.getOne(await Validation.validate(CommonDto.IdParams, params)).then(ApplicationError.notFoundIfNull);
  }

  @Post('/create')
  async create(@Body() user: UserDto.CreateParams) {
    return this.usersService.create({ data: await Validation.validate(UserDto.CreateParams, user) });
  }

  @Patch('/update/:id')
  async update(@Param() params: CommonDto.IdParams, @Body() user: UserDto.UpdateParams) {
    return this.usersService.update({
      where: await Validation.validate(CommonDto.IdParams, params),
      data: await Validation.validate(UserDto.UpdateParams, user),
    });
  }

  @HttpCode(204)
  @Delete('/delete/:id')
  async delete(@Param() params: CommonDto.IdParams) {
    await Validation.validate(CommonDto.IdParams, params);
    await this.usersService.delete({ id: params.id });
  }
}
