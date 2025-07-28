import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDTO, UpdateInvoiceDTO } from './dto/invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('/create')
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDTO) {
    const invoice = await this.invoiceService.createInvoice(createInvoiceDto);
    return invoice; // <-- Solo la factura
  }

  @Get('/')
  async getAllInvoices() {
    const invoices = await this.invoiceService.getAllInvoices();
    return invoices; // <-- Retorna todas las facturas
  }
  @Get('/:id')
  async getInvoiceById(@Param('id') id: string) {
    const invoice = await this.invoiceService.getInvoiceById(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice; // <-- Retorna la factura por ID
  }
  @Delete('/:id')
  async deleteInvoice(@Param('id') id: string) {
    const deletedInvoice = await this.invoiceService.deleteInvoice(id);
    if (!deletedInvoice) {
      throw new NotFoundException('Invoice not found');
    }
    return deletedInvoice; // <-- Retorna la factura eliminada
  }
  @Put('/:id')
  async updateInvoice(
    @Param('id') id: string,
    @Body() updatedInvoice: UpdateInvoiceDTO,
  ) {
    const updatedInvoiceData = await this.invoiceService.updateInvoice(
      id,
      updatedInvoice,
    );
    if (!updatedInvoiceData) {
      throw new NotFoundException('Invoice not found');
    }
    return updatedInvoiceData; // <-- Retorna la factura actualizada
  }
}
