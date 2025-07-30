import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { brandModule } from './brand/brand.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ProductModule,
    MongooseModule.forRoot(
      'mongodb+srv://alexgabriela2003:nNZdqfzdrpznj5r7@nailsinventory.f2ao3qy.mongodb.net/inventory?retryWrites=true&w=majority',
      {},
    ),
    AuthModule,
    brandModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
