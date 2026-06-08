import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

const PROPERTY_TYPES = [
  'apartment', 'duplex', 'bungalow', 'self_contained',
  'mini_flat', 'room', 'studio', 'compound',
] as const;

const PAYMENT_FREQUENCIES = ['yearly', 'biannual', 'quarterly', 'monthly'] as const;

export class CreatePropertyDto {
  @ApiProperty({ example: 'Lovely 2-bedroom in Lekki Phase 1' })
  @IsString()
  title: string;

  @ApiProperty({ enum: PROPERTY_TYPES })
  @IsEnum(PROPERTY_TYPES)
  type: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  bedrooms: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  bathrooms: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  toilets: number;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsInt()
  @Min(0)
  squareFootage?: number;

  @ApiPropertyOptional({ example: 2018 })
  @IsOptional()
  @IsInt()
  yearBuilt?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 120000000, description: 'Annual rent in kobo (₦1.2M = 120000000)' })
  @IsInt()
  @Min(1)
  annualRent: number;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  serviceCharge?: number;

  @ApiPropertyOptional({ example: 10000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  cautionDeposit?: number;

  @ApiPropertyOptional({ example: 10000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  agencyFee?: number;

  @ApiPropertyOptional({ type: [String], enum: PAYMENT_FREQUENCIES })
  @IsOptional()
  @IsArray()
  @IsEnum(PAYMENT_FREQUENCIES, { each: true })
  acceptedPaymentFrequencies?: string[];

  @ApiPropertyOptional({ type: [String], example: ['parking', 'generator', 'security'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Lekki Phase 1' })
  @IsString()
  area: string;

  @ApiProperty({ example: '15 Admiralty Way, Lekki Phase 1' })
  @IsString()
  address: string;

  @ApiPropertyOptional({ example: 6.4281 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 3.4219 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdatePropertyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ enum: PROPERTY_TYPES })
  @IsOptional()
  @IsEnum(PROPERTY_TYPES)
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  toilets?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  squareFootage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  yearBuilt?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  annualRent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  serviceCharge?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  cautionDeposit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  agencyFee?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsEnum(PAYMENT_FREQUENCIES, { each: true })
  acceptedPaymentFrequencies?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  area?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class AddPhotoDto {
  @ApiProperty({ example: 'https://storage.example.com/photo.jpg' })
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({
    enum: ['living_room', 'kitchen', 'bedroom', 'bathroom', 'exterior', 'surroundings', 'other'],
  })
  @IsOptional()
  @IsEnum(['living_room', 'kitchen', 'bedroom', 'bathroom', 'exterior', 'surroundings', 'other'])
  photoType?: string;
}
