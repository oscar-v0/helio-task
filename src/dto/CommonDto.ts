import { IsMongoId } from '@nestjs/class-validator';

export namespace CommonDto {
  export class IdParams {
    @IsMongoId()
    id: string;
  }
}
