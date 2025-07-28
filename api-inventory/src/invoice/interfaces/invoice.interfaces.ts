import { Document } from 'mongoose';

export interface Invoice extends Document {
  readonly invoiceNumber: string;
  readonly customerName?: string;
  readonly dateIssued?: Date;
  readonly totalAmount?: number;
  readonly customerPhone?: string;
  readonly idCard?: string;
  readonly items: Array<{
    itemName: string;
    quantity: number;
    pricePerItem: number;
  }>;
}
