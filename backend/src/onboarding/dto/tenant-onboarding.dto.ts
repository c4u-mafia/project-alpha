import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class TenantNinDto {
  @ApiProperty({ example: '12345678901', description: '11-digit NIN' })
  @IsString()
  @Length(11, 11, { message: 'NIN must be exactly 11 digits' })
  @Matches(/^\d{11}$/, { message: 'NIN must contain only digits' })
  nin: string;
}

export class TenantEmploymentDto {
  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  employerName?: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  jobRole?: string;

  @ApiPropertyOptional({ enum: ['under_50k', '50k_100k', '100k_200k', '200k_500k', 'above_500k'] })
  @IsOptional()
  @IsEnum(['under_50k', '50k_100k', '100k_200k', '200k_500k', 'above_500k'])
  monthlyIncomeRange?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  guarantorName?: string;

  @ApiPropertyOptional({ example: '+2348012345678' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: 'guarantorPhone must be a valid phone number' })
  guarantorPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  guarantorConfirmed?: boolean;
}

export class TenantPreferencesDto {
  @ApiPropertyOptional({ example: 10000000, description: 'Min budget in kobo (₦100k = 10000000)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  preferredBudgetMin?: number;

  @ApiPropertyOptional({ example: 50000000, description: 'Max budget in kobo' })
  @IsOptional()
  @IsInt()
  @Min(0)
  preferredBudgetMax?: number;

  @ApiPropertyOptional({ type: [String], example: ['Lekki', 'Yaba'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  preferredAreas?: string[];

  @ApiPropertyOptional({ type: [Number], example: [1, 2] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  preferredBedrooms?: number[];

  @ApiPropertyOptional({
    enum: ['immediately', 'within_1_month', 'within_3_months', 'within_6_months', 'flexible'],
  })
  @IsOptional()
  @IsEnum(['immediately', 'within_1_month', 'within_3_months', 'within_6_months', 'flexible'])
  moveInTimeline?: string;
}
