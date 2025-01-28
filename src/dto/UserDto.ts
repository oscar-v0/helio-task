import { IsEmail, IsMongoId, IsOptional, IsString, MaxLength, MinLength } from '@nestjs/class-validator';

export namespace UserDto {
  export class CreateParams {
    @MinLength(1)
    @MaxLength(30)
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsMongoId()
    companyId: string;
  }

  export class UpdateParams {
    @MinLength(1)
    @MaxLength(30)
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
  }
}
