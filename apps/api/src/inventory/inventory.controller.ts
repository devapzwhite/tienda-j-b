import { Controller, Post, Body, Get } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { ReceiveInventoryDto } from './dto/receive-inventory.dto.js';

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
}
