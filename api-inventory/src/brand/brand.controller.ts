/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Res,
  Param,
  Delete,
  Put,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { CreatebrandDTO, UpdatebrandDTO } from './dto/brand.dto';
import { brandService } from './brand.service';

@Controller('brand')
export class brandController {
  constructor(private readonly brandService: brandService) {}

  @Post('/create')
  async createbrand(@Body() createbrandDto: CreatebrandDTO) {
    const brand = await this.brandService.createbrand(createbrandDto);
    return brand; // <-- Solo la sucursal
  }
  @Get('/')
  async getAllbrandes(@Res() res) {
    console.log('Fetching all brandes');

    try {
      const brandes = await this.brandService.getAllbrandes();
      res.status(HttpStatus.OK).json(brandes);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching brandes',
        error: err.message,
      });
    }
  }

  @Get('/:id')
  async getbrandById(@Res() res, @Param('id') id: string) {
    console.log('Fetching brand by ID:', id);
    try {
      const brand = await this.brandService.getbrandById(id);
      if (!brand) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'brand not found',
        });
      }
      res.status(HttpStatus.OK).json(brand);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching brand',
        error: err.message,
      });
    }
  }
  @Delete('/:id')
  async deletebrand(@Res() res, @Param('id') id: string) {
    console.log('Deleting brand with ID:', id);
    try {
      const deletedbrand = await this.brandService.deletebrand(id);
      if (!deletedbrand) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'brand not found',
        });
      }
      res.status(HttpStatus.OK).json({
        message: 'brand deleted successfully',
        brand: deletedbrand,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting brand',
        error: err.message,
      });
    }
  }
  @Put('/:id')
  async updatebrand(
    @Res() res,
    @Param('id') id: string,
    @Body() updatedbrand: UpdatebrandDTO,
  ) {
    console.log('Updating brand with ID:', id);
    try {
      const updatedbrandData = await this.brandService.updatebrand(
        id,
        updatedbrand,
      );
      if (!updatedbrandData) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'brand not found',
        });
      }
      res.status(HttpStatus.OK).json({
        message: 'brand updated successfully',
        brand: updatedbrandData,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating brand',
        error: err.message,
      });
    }
  }
}
