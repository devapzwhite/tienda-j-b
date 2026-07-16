import { Module } from '@nestjs/common';
import { ColorsController } from './colors.controller.js';
import { ColorsService } from './colors.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ColorsController],
  providers: [ColorsService],
})
export class ColorsModule {}
