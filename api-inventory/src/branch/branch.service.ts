import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Branch } from './interfaces/branch.interfaces';
import { CreateBranchDTO, UpdateBranchDTO } from './dto/branch.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel('Branch') private readonly branchModel: Model<Branch>,
  ) {}

  async getAllBranches(): Promise<Branch[]> {
    const branches = await this.branchModel.find();
    return branches;
  }

  async getBranchById(id: string): Promise<Branch | null> {
    const branch = await this.branchModel.findById(id);
    return branch;
  }
  async createBranch(createBranchDto: CreateBranchDTO): Promise<Branch> {
    const newBranch = new this.branchModel(createBranchDto);
    return await newBranch.save();
  }
  async deleteBranch(id: string): Promise<Branch | null> {
    const deletedBranch = await this.branchModel.findByIdAndDelete(id);
    return deletedBranch;
  }
  async updateBranch(
    id: string,
    updatedBranch: UpdateBranchDTO,
  ): Promise<Branch | null> {
    const updatedBranchData = await this.branchModel.findByIdAndUpdate(
      id,
      updatedBranch,
      {
        new: true,
      },
    );
    return updatedBranchData;
  }
}
