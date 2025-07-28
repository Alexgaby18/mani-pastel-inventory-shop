import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { MongooseModule } from '@nestjs/mongoose';
import { invoiceSchema } from './schemas/invoice.schemas';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Invoice', schema: invoiceSchema }]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
