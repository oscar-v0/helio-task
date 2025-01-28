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

export namespace ProjectDto {
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
