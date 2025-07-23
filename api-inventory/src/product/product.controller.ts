/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Res,
  HttpStatus,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/product.dto';
import { UpdatedProductDTO } from './dto/udapted.product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  async createProduct(@Body() createProductDto: CreateProductDTO) {
    const product = await this.productService.createProduct(createProductDto);
    return product; // <-- Solo el producto
  }

  @Get('/')
  async getAllProducts(@Res() res) {
    console.log('Fetching all products');

    try {
      const products = await this.productService.getAllProducts();
      res.status(HttpStatus.OK).json(products);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching products',
        error: err.message,
      });
    }
  }

  @Get('/:id')
  async getProductById(@Res() res, @Param('id') id: string) {
    console.log('Fetching product by ID:', id);

    try {
      const product = await this.productService.getProductById(id);
      if (!product) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Product not found',
        });
      }
      res.status(HttpStatus.OK).json(product);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching product',
        error: err.message,
      });
    }
  }

  @Delete('/:id')
  async deleteProduct(@Res() res, @Param('id') id: string) {
    console.log('Deleting product with ID:', id);

    try {
      const deletedProduct = await this.productService.deleteProduct(id);
      if (!deletedProduct) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Product not found',
        });
      }
      res.status(HttpStatus.OK).json({
        message: 'Product deleted successfully',
        product: deletedProduct,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting product',
        error: err.message,
      });
    }
  }

  @Put('/:id')
  async updateProduct(
    @Res() res,
    @Param('id') id: string,
    @Body() updateProducts: UpdatedProductDTO,
  ) {
    console.log('Updating product with ID:', id, 'Data:', updateProducts);

    try {
      const updatedProduct = await this.productService.updateProduct(
        id,
        updateProducts,
      );
      if (!updatedProduct) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Product not found',
        });
      }
      res.status(HttpStatus.OK).json({
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating product',
        error: err.message,
      });
    }
    return updateProducts; // <-- Solo el producto actualizado
  }
}
