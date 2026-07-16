import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.brands.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: { name: string; description?: string }) {
    const existing = await this.prisma.brands.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      throw new ConflictException('Ya existe una marca con ese nombre');
    }
    return this.prisma.brands.create({ data });
  }
}
