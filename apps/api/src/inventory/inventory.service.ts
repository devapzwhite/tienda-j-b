import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ReceiveInventoryDto } from './dto/receive-inventory.dto.js';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async receive(dto: ReceiveInventoryDto) {
    const { locationId, productId, variantId, quantityUnits, unitCost } = dto;

    // 1. Find the corresponding stock unit
    const stockUnit = await this.prisma.product_stock_units.findFirst({
      where: {
        product_id: productId,
        variant_id: variantId || null,
        unit_code: 'UNIDAD',
      },
    });

    if (!stockUnit) {
      throw new NotFoundException('No se encontró la unidad de stock para este producto/variante');
    }

    // 2. Perform transaction: Create movement and update stock
    return this.prisma.$transaction(async (tx) => {
      // Create movement
      const movement = await tx.inventory_movements.create({
        data: {
          stock_unit_id: stockUnit.id,
          location_id: locationId,
          movement_type: 'entry',
          quantity_units: quantityUnits,
          unit_cost: unitCost,
          notes: 'Ingreso manual por variante',
        },
      });

      // Upsert stock
      const stock = await tx.inventory_stock.findUnique({
        where: {
          stock_unit_id_location_id: {
            stock_unit_id: stockUnit.id,
            location_id: locationId,
          },
        },
      });

      if (stock) {
        await tx.inventory_stock.update({
          where: {
            stock_unit_id_location_id: {
              stock_unit_id: stockUnit.id,
              location_id: locationId,
            },
          },
          data: {
            quantity_units: stock.quantity_units + quantityUnits,
            updated_at: new Date(),
          },
        });
      } else {
        await tx.inventory_stock.create({
          data: {
            stock_unit_id: stockUnit.id,
            location_id: locationId,
            quantity_units: quantityUnits,
          },
        });
      }

      return movement;
    });
  }

  async getLocations() {
    return this.prisma.locations.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    });
  }

  async getStock() {
    return this.prisma.products.findMany({
      include: {
        categories: { select: { name: true } },
        product_stock_units: {
          include: {
            inventory_stock: {
              include: {
                locations: { select: { name: true, code: true } }
              }
            },
            product_variants: {
              include: {
                colors: { select: { name: true, code: true } }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }
}
