import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

/**
 * PrismaModule is global so PrismaService is available
 * across all feature modules without re-importing.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
