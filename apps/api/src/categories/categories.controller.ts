import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles('admin', 'jefe', 'administrador')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @Roles('admin', 'jefe', 'administrador')
  create(@Body() body: { name: string; description?: string }) {
    return this.categoriesService.create(body);
  }
}
