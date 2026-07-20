import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateColorDto } from './dto/create-color.dto.js';

@Injectable()
export class ColorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.colors.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(createColorDto: CreateColorDto) {
    const existingColor = await this.prisma.colors.findUnique({
      where: { name: createColorDto.name },
    });

    if (existingColor) {
      throw new ConflictException('Color with this name already exists');
    }

    return this.prisma.colors.create({
      data: {
        name: createColorDto.name,
        code: createColorDto.code,
      },
    });
  }
}
