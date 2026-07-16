import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ColorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.colors.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
