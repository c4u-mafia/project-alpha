import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class LandlordProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCompany?: boolean;

  @ApiPropertyOptional({ example: 'Acme Properties Ltd' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDiaspora?: boolean;
}

export class LandlordNinDto {
  @ApiProperty({ example: '12345678901', description: '11-digit NIN' })
  @IsString()
  @Length(11, 11, { message: 'NIN must be exactly 11 digits' })
  @Matches(/^\d{11}$/, { message: 'NIN must contain only digits' })
  nin: string;
}

export class LandlordDocumentDto {
  @ApiProperty({
    enum: [
      'certificate_of_occupancy',
      'deed_of_assignment',
      'utility_bill',
      'government_id',
      'passport',
    ],
  })
  @IsEnum([
    'certificate_of_occupancy',
    'deed_of_assignment',
    'utility_bill',
    'government_id',
    'passport',
  ])
  documentType: string;

  @ApiProperty({ example: 'https://storage.example.com/doc.pdf' })
  @IsString()
  documentUrl: string;

  @ApiPropertyOptional({ description: 'Property ID if this doc is property-linked (C of O, deed)' })
  @IsOptional()
  @IsString()
  propertyId?: string;
}

export class LandlordBankDto {
  @ApiProperty({ example: '044', description: 'Paystack bank code' })
  @IsString()
  bankCode: string;

  @ApiProperty({ example: 'Access Bank' })
  @IsString()
  bankName: string;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Account number must be 10 digits' })
  accountNumber: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  accountName: string;
}
