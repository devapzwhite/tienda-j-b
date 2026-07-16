import { Controller, Get, UseGuards } from '@nestjs/common';
import { ColorsService } from './colors.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('colors')
@UseGuards(JwtAuthGuard)
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  findAll() {
    return this.colorsService.findAll();
  }
}
