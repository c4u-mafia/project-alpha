import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRentGoalDto {
  @ApiProperty({ example: 150000000, description: 'Target amount in kobo' })
  @IsInt()
  @Min(100)
  targetAmount: number;

  @ApiProperty({
    example: '2026-09-01T00:00:00Z',
    description: 'Deadline ISO timestamp',
  })
  @IsString()
  deadline: string;

  @ApiPropertyOptional({ example: 'Help me secure a home for my family.' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ description: 'Link to an active tenancy' })
  @IsOptional()
  @IsString()
  tenancyId?: string;

  @ApiPropertyOptional({ description: 'Link to a target property listing' })
  @IsOptional()
  @IsString()
  propertyId?: string;
}

export class ContributeDto {
  @ApiProperty({ example: 5000000, description: 'Contribution amount in kobo' })
  @IsInt()
  @Min(100)
  amount: number;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Required for guest sponsors',
  })
  @IsOptional()
  @IsString()
  sponsorName?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email used to initialize the Paystack checkout',
  })
  @IsEmail()
  sponsorEmail: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiPropertyOptional({ example: 'Stay strong! 🙏' })
  @IsOptional()
  @IsString()
  message?: string;
}
