import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { ReceiveInventoryDto } from './dto/receive-inventory.dto.js';
import { CreateLocationDto } from './dto/create-location.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('locations')
  getLocations() {
    return this.inventoryService.getLocations();
  }

  @Get('stock')
  getStock() {
    return this.inventoryService.getStock();
  }

  @Post('receive')
  receive(@Body() dto: ReceiveInventoryDto) {
    return this.inventoryService.receive(dto);
  }

  @Post('locations')
  @Roles('admin', 'jefe')
  @UseGuards(JwtAuthGuard, RolesGuard)
  createLocation(@Body() dto: CreateLocationDto) {
    return this.inventoryService.createLocation(dto);
  }
}
