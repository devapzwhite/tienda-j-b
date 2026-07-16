import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    // Basic product data
    const productData = {
      name: dto.name,
      description: dto.description,
      category_id: dto.categoryId,
      brand_id: dto.brandId,
    };

    // We use a transaction to insert the product, presentations, and variants
    return this.prisma.$transaction(async (tx) => {
      // 1. Create Product
      const product = await tx.products.create({
        data: productData,
      });

      // 2. Create Presentations and Variants
      for (const p of dto.presentations) {
        // Fallback barcode if not provided
        const presBarcode = p.barcode || randomUUID();
        
        const presentation = await tx.product_presentations.create({
          data: {
            product_id: product.id,
            name: p.name,
            barcode: presBarcode,
            sale_price: p.salePrice,
          },
        });

        // 3. Create variants if they exist
        if (p.variants && p.variants.length > 0) {
          for (const v of p.variants) {
            // Check if product_variant already exists for this color
            let variant = await tx.product_variants.findFirst({
              where: { product_id: product.id, color_id: v.colorId },
            });

            if (!variant) {
              variant = await tx.product_variants.create({
                data: {
                  product_id: product.id,
                  color_id: v.colorId,
                  internal_code: v.internalCode || `${product.id.substring(0, 8)}-${v.colorId.substring(0, 8)}`,
                },
              });
            }

            const varBarcode = v.barcode || randomUUID();

            await tx.product_presentation_variants.create({
              data: {
                presentation_id: presentation.id,
                variant_id: variant.id,
                barcode: varBarcode,
                sale_price: v.salePrice ?? p.salePrice, // fallback to presentation price
              },
            });
          }
        }
      }

      // 4. Create Stock Units
      const createdVariants = await tx.product_variants.findMany({ where: { product_id: product.id } });
      const createdPresentations = await tx.product_presentations.findMany({ where: { product_id: product.id } });
      const stockUnits: any[] = [];

      if (createdVariants.length > 0) {
        for (const variant of createdVariants) {
          const su = await tx.product_stock_units.create({
            data: {
              product_id: product.id,
              variant_id: variant.id,
              unit_code: 'UNIDAD',
              unit_name: 'Unidad',
            }
          });
          stockUnits.push(su);
        }
      } else {
        const su = await tx.product_stock_units.create({
          data: {
            product_id: product.id,
            unit_code: 'UNIDAD',
            unit_name: 'Unidad',
          }
        });
        stockUnits.push(su);
      }

      // 5. Create Presentation Conversions
      for (const presentation of createdPresentations) {
        for (const su of stockUnits) {
          // If variants exist, ideally we only link the stock unit of the variant that is in this presentation.
          // Let's check if this presentation has this variant
          if (su.variant_id) {
            const hasVariant = await tx.product_presentation_variants.findFirst({
              where: { presentation_id: presentation.id, variant_id: su.variant_id }
            });
            if (!hasVariant) continue;
          }
          
          await tx.presentation_conversions.create({
            data: {
              presentation_id: presentation.id,
              stock_unit_id: su.id,
              // Simple heuristic: if name contains number, use it. But for now, we assume 1.
              // Users will need to manually adjust conversions for boxes.
              // The frontend doesn't send units_per_presentation, so default to 1.
              units_per_presentation: 1, 
            }
          });
        }
      }

      // 6. Return full tree
      return this.findOne(product.id, tx);
    });
  }

  async findAll() {
    return this.prisma.products.findMany({
      include: {
        categories: { select: { id: true, name: true } },
        brands: { select: { id: true, name: true } },
        product_presentations: {
          include: {
            product_presentation_variants: {
              include: {
                product_variants: {
                  include: {
                    colors: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string, tx: any = this.prisma) {
    const product = await tx.products.findUnique({
      where: { id },
      include: {
        categories: true,
        brands: true,
        product_presentations: {
          include: {
            product_presentation_variants: {
              include: {
                product_variants: {
                  include: {
                    colors: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    await this.findOne(id); // Throws if not found

    const { presentations, categoryId, brandId, ...productData } = dto;

    return this.prisma.products.update({
      where: { id },
      data: {
        ...productData,
        ...(categoryId && { category_id: categoryId }),
        ...(brandId && { brand_id: brandId }),
      },
      include: {
        categories: true,
        brands: true,
        product_presentations: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Throws if not found
    return this.prisma.products.delete({ where: { id } });
  }
}
