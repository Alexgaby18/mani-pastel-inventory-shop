import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { MongooseModule } from '@nestjs/mongoose';
import { invoiceSchema } from './schemas/invoice.schemas';
import { ProductModule } from '../product/product.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Invoice', schema: invoiceSchema }]),
    ProductModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
