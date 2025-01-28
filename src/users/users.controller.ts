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
    await Validation.validate(CommonDto.IdParams, params);
    return this.usersService.getOne({ id: params.id }).then(ApplicationError.notFoundIfNull);
  }

  @Post('/create')
  async create(@Body() user: UserDto.CreateParams) {
    await Validation.validate(UserDto.CreateParams, user);
    return this.usersService.create({ data: user });
  }

  @Patch('/update/:id')
  async update(@Param() params: CommonDto.IdParams, @Body() user: UserDto.UpdateParams) {
    await Validation.validate(CommonDto.IdParams, params);
    await Validation.validate(UserDto.UpdateParams, user);

    return this.usersService.update({
      where: { id: params.id },
      data: user,
    });
  }

  @HttpCode(204)
  @Delete('/delete/:id')
  async delete(@Param() params: CommonDto.IdParams) {
    await Validation.validate(CommonDto.IdParams, params);
    await this.usersService.delete({ id: params.id });
  }
}
