import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service.js';
import { BrandsController } from './brands.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
