import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('brands')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @Roles('admin', 'jefe', 'administrador')
  findAll() {
    return this.brandsService.findAll();
  }

  @Post()
  @Roles('admin', 'jefe', 'administrador')
  create(@Body() body: { name: string; description?: string }) {
    return this.brandsService.create(body);
  }
}
