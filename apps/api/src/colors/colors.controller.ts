import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ColorsService } from './colors.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateColorDto } from './dto/create-color.dto.js';

@Controller('colors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  findAll() {
    return this.colorsService.findAll();
  }

  @Post()
  @Roles('admin', 'jefe', 'administrador')
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }
}
