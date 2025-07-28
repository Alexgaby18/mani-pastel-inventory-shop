import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  code: string;
  @IsString()
  name: string;
  dateAdded?: Date;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsNumber()
  @IsNotEmpty()
  stock: number;
  flete: number;
  @IsNumber()
  @IsNotEmpty()
  cost: number;
  unit_measure: string;
  brand?: string;
}
