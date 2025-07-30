import { Module } from '@nestjs/common';
import { brandController } from './brand.controller';
import { brandService } from './brand.service';
import { MongooseModule } from '@nestjs/mongoose';
import { brandSchema } from './schemas/branch.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'brand', schema: brandSchema }]),
  ],
  controllers: [brandController],
  providers: [brandService],
})
export class brandModule {}
