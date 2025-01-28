import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CommonDto } from 'src/dto/CommonDto';
import { CompanyDto } from 'src/dto/CompanyDto';
import { ApplicationError } from 'src/utils/ApplicationError';
import { Validation } from 'src/utils/Validation';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('/')
  getMany() {
    return this.companiesService.getMany();
  }

  @Get('/:id')
  async getOne(@Param() params: CommonDto.IdParams) {
    return this.companiesService.getOne(await Validation.validate(CommonDto.IdParams, params)).then(ApplicationError.notFoundIfNull);
  }

  @Post('/create')
  async create(@Body() user: CompanyDto.CreateParams) {
    return this.companiesService.create({ data: await Validation.validate(CompanyDto.CreateParams, user) });
  }

  @Patch('/update/:id')
  async update(@Param() params: CommonDto.IdParams, @Body() user: CompanyDto.UpdateParams) {
    return this.companiesService.update({
      where: await Validation.validate(CommonDto.IdParams, params),
      data: await Validation.validate(CompanyDto.UpdateParams, user),
    });
  }

  @HttpCode(204)
  @Delete('/delete/:id')
  async delete(@Param() params: CommonDto.IdParams) {
    await this.companiesService.delete(await Validation.validate(CommonDto.IdParams, params));
  }
}
