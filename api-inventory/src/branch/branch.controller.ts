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
import { CreateBranchDTO, UpdateBranchDTO } from './dto/branch.dto';
import { BranchService } from './branch.service';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post('/create')
  async createBranch(@Body() createBranchDto: CreateBranchDTO) {
    const branch = await this.branchService.createBranch(createBranchDto);
    return branch; // <-- Solo la sucursal
  }
  @Get('/')
  async getAllBranches(@Res() res) {
    console.log('Fetching all branches');

    try {
      const branches = await this.branchService.getAllBranches();
      res.status(HttpStatus.OK).json(branches);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching branches',
        error: err.message,
      });
    }
  }

  @Get('/:id')
  async getBranchById(@Res() res, @Param('id') id: string) {
    console.log('Fetching branch by ID:', id);
    try {
      const branch = await this.branchService.getBranchById(id);
      if (!branch) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Branch not found',
        });
      }
      res.status(HttpStatus.OK).json(branch);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching branch',
        error: err.message,
      });
    }
  }
  @Delete('/:id')
  async deleteBranch(@Res() res, @Param('id') id: string) {
    console.log('Deleting branch with ID:', id);
    try {
      const deletedBranch = await this.branchService.deleteBranch(id);
      if (!deletedBranch) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Branch not found',
        });
      }
      res.status(HttpStatus.OK).json({
        message: 'Branch deleted successfully',
        branch: deletedBranch,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting branch',
        error: err.message,
      });
    }
  }
  @Put('/:id')
  async updateBranch(
    @Res() res,
    @Param('id') id: string,
    @Body() updatedBranch: UpdateBranchDTO,
  ) {
    console.log('Updating branch with ID:', id);
    try {
      const updatedBranchData = await this.branchService.updateBranch(
        id,
        updatedBranch,
      );
      if (!updatedBranchData) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Branch not found',
        });
      }
      res.status(HttpStatus.OK).json({
        message: 'Branch updated successfully',
        branch: updatedBranchData,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating branch',
        error: err.message,
      });
    }
  }
}
