import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsArray,
  MinLength,
  Min,
  ValidateNested,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePresentationVariantDto {
  @IsUUID('4')
  colorId: string;

  @IsOptional()
  @IsString()
  internalCode?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;
}

export class CreatePresentationDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsNumber()
  @Min(0)
  salePrice: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePresentationVariantDto)
  variants?: CreatePresentationVariantDto[];
}

export class CreateProductDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID('4', { message: 'La categoría debe ser un ID válido' })
  categoryId: string;

  @IsOptional()
  @IsUUID('4', { message: 'La marca debe ser un ID válido' })
  brandId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePresentationDto)
  presentations: CreatePresentationDto[];
}
