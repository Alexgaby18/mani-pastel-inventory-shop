import { IsNotEmpty, IsString } from 'class-validator';

export class CreatebrandDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdatebrandDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
