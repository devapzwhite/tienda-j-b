import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class ReceiveInventoryDto {
  @IsString()
  locationId: string;

  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  variantId?: string;

  @IsNumber()
  @Min(1)
  quantityUnits: number;
}
