import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListingsQueryDto {
  @ApiPropertyOptional({ example: 'Lekki' })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 10000000, description: 'Min annual rent in kobo' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minRent?: number;

  @ApiPropertyOptional({ example: 200000000, description: 'Max annual rent in kobo' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxRent?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({
    enum: ['apartment', 'duplex', 'bungalow', 'self_contained', 'mini_flat', 'room', 'studio', 'compound'],
  })
  @IsOptional()
  @IsEnum(['apartment', 'duplex', 'bungalow', 'self_contained', 'mini_flat', 'room', 'studio', 'compound'])
  type?: string;

  @ApiPropertyOptional({ example: 'parking', description: 'Filter by amenity keyword' })
  @IsOptional()
  @IsString()
  amenity?: string;

  @ApiPropertyOptional({
    enum: ['yearly', 'biannual', 'quarterly', 'monthly'],
  })
  @IsOptional()
  @IsEnum(['yearly', 'biannual', 'quarterly', 'monthly'])
  paymentFrequency?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
