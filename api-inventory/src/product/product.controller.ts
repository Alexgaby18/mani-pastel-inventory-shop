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
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  async createProduct(@Res() res, @Body() createProductDto: CreateProductDTO) {
    console.log('Creating product:', createProductDto);

    const product = await this.productService.createProduct(createProductDto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    res.status(HttpStatus.OK).json({
      message: 'Product created successfully',
      product: product,
    });
  }

  @Get('/')
  async getAllProducts(@Res() res) {
    console.log('Fetching all products');

    try {
      const products = await this.productService.getAllProducts();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      res.status(HttpStatus.OK).json(products);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching products',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Product not found',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      res.status(HttpStatus.OK).json(product);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching product',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Product not found',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      res.status(HttpStatus.OK).json({
        message: 'Product deleted successfully',
        product: deletedProduct,
      });
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting product',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: err.message,
      });
    }
  }

  @Put('/:id')
  async updateProduct(
    @Res() res,
    @Param('id') id: string,
    @Body() createProductDto: CreateProductDTO,
  ) {
    console.log('Updating product with ID:', id, 'Data:', createProductDto);

    try {
      const updatedProduct = await this.productService.updateProduct(
        id,
        createProductDto,
      );
      if (!updatedProduct) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Product not found',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      res.status(HttpStatus.OK).json({
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating product',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: err.message,
      });
    }
  }
}
