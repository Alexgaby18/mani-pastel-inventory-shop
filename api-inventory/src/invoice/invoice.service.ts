/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './interfaces/invoice.interfaces';
import { CreateInvoiceDTO, UpdateInvoiceDTO } from './dto/invoice.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
    private readonly productService: ProductService,
  ) {}

  async getAllInvoices(): Promise<Invoice[]> {
    const invoices = await this.invoiceModel.find();
    return invoices;
  }
  async getInvoiceById(id: string): Promise<Invoice | null> {
    const invoice = await this.invoiceModel.findById(id);
    return invoice;
  }
  private calculateTotalAmount(items: any[]): number {
    return items.reduce(
      (total, item) => total + item.pricePerItem * item.quantity,
      0,
    );
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDTO): Promise<Invoice> {
    // Verificar y disminuir stock usando los IDs que ahora están en itemName
    for (const item of createInvoiceDto.items) {
      await this.productService.decrementStock(item.itemName, item.quantity);
    }

    // Calcular el total
    const totalAmount = createInvoiceDto.items.reduce(
      (total, item) => total + item.pricePerItem * item.quantity,
      0,
    );

    // Crear la factura (itemName ahora contiene el ID)
    const newInvoice = new this.invoiceModel({
      ...createInvoiceDto,
      totalAmount,
    });

    return await newInvoice.save();
  }

  async updateInvoice(
    id: string,
    updatedInvoice: UpdateInvoiceDTO,
  ): Promise<Invoice | null> {
    if (updatedInvoice.items) {
      const totalAmount = this.calculateTotalAmount(updatedInvoice.items);
      updatedInvoice.totalAmount = totalAmount;
    }

    const updatedInvoiceData = await this.invoiceModel.findByIdAndUpdate(
      id,
      updatedInvoice,
      {
        new: true,
      },
    );
    return updatedInvoiceData;
  }

  async deleteInvoice(id: string): Promise<Invoice | null> {
    const deletedInvoice = await this.invoiceModel.findByIdAndDelete(id);
    return deletedInvoice;
  }
  async getTotalAmount(id: string): Promise<number> {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) {
      return 0; // O manejar el caso de error según sea necesario
    }
    return invoice.items.reduce(
      (total, item) => total + item.pricePerItem * item.quantity,
      0,
    );
  }
  async decrementProductStock(
    productId: string,
    quantity: number,
  ): Promise<boolean> {
    return this.productService.decrementStock(productId, quantity);
  }
}
