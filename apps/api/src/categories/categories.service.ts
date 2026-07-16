import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.categories.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: { name: string; description?: string }) {
    const existing = await this.prisma.categories.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }
    return this.prisma.categories.create({ data });
  }
}
