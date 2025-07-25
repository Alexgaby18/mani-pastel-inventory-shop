import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { MongooseModule } from '@nestjs/mongoose';
import { branchSchema } from './schemas/branch.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Branch', schema: branchSchema }]),
  ],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
