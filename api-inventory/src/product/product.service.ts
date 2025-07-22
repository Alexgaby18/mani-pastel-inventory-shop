import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interfaces';
import { CreateProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find();
    return products;
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await this.productModel.findById(id);
    return product;
  }

  async createProduct(createProductDto: CreateProductDTO): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return await newProduct.save();
  }

  async deleteProduct(id: string): Promise<Product | null> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);
    return deletedProduct;
  }

  async updateProduct(
    id: string,
    createProductDto: CreateProductDTO,
  ): Promise<Product | null> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      createProductDto,
      {
        new: true,
      },
    );
    return updatedProduct;
  }
}
