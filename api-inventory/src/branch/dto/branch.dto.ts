import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBranchDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateBranchDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
