import { IsOptional, IsString, MaxLength, MinLength } from '@nestjs/class-validator';

export namespace CompanyDto {
  export class CreateParams {
    @MaxLength(30)
    @MinLength(1)
    @IsString()
    name: string;

    @MaxLength(30)
    @MinLength(1)
    @IsString()
    @IsOptional()
    industry: string;
  }

  export class UpdateParams {
    @MaxLength(30)
    @MinLength(1)
    @IsString()
    @IsOptional()
    name?: string;

    @MaxLength(30)
    @MinLength(1)
    @IsString()
    @IsOptional()
    industry?: string;
  }
}
