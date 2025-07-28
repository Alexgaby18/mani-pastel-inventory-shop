import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateInvoiceDTO {
  @IsNotEmpty()
  @IsString()
  invoiceNumber: string;
  @IsString()
  customerName?: string;
  @IsNumber()
  totalAmount?: number;
  @IsString()
  customerPhone?: string;
  @IsString()
  idCard?: string;
  items: Array<{
    itemName: string;
    quantity: number;
    pricePerItem: number;
  }>;
}

export class UpdateInvoiceDTO {
  @IsString()
  invoiceNumber?: string;
  @IsString()
  customerName?: string;
  @IsNumber()
  totalAmount?: number;
  @IsString()
  customerPhone?: string;
  @IsString()
  idCard?: string;
  items?: Array<{
    itemName: string;
    quantity: number;
    pricePerItem: number;
  }>;
}
