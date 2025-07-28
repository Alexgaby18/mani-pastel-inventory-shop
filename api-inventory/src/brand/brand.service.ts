import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { brand } from './interfaces/brand.interfaces';
import { CreatebrandDTO, UpdatebrandDTO } from './dto/brand.dto';

@Injectable()
export class brandService {
  constructor(
    @InjectModel('brand') private readonly brandModel: Model<brand>,
  ) {}

  async getAllbrandes(): Promise<brand[]> {
    const brandes = await this.brandModel.find();
    return brandes;
  }

  async getbrandById(id: string): Promise<brand | null> {
    const brand = await this.brandModel.findById(id);
    return brand;
  }
  async createbrand(createbrandDto: CreatebrandDTO): Promise<brand> {
    const newbrand = new this.brandModel(createbrandDto);
    return await newbrand.save();
  }
  async deletebrand(id: string): Promise<brand | null> {
    const deletedbrand = await this.brandModel.findByIdAndDelete(id);
    return deletedbrand;
  }
  async updatebrand(
    id: string,
    updatedbrand: UpdatebrandDTO,
  ): Promise<brand | null> {
    const updatedbrandData = await this.brandModel.findByIdAndUpdate(
      id,
      updatedbrand,
      {
        new: true,
      },
    );
    return updatedbrandData;
  }
}
