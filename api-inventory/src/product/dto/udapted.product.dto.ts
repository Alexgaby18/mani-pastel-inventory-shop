import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdatedProductDTO {
  @IsString()
  @IsOptional()
  name: string;
  dateAdded?: Date;
  @IsNumber()
  @IsOptional()
  price: number;
  @IsNumber()
  @IsOptional()
  stock: number;
  @IsOptional()
  flete: number;
  @IsNumber()
  @IsOptional()
  cost: number;
  @IsOptional()
  unit_measure: string;
  brand?: string;
}
