import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewKycDocumentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}

export class RejectKycDocumentDto {
  @ApiProperty({ example: 'Document is blurry or unreadable.' })
  @IsString()
  reason: string;
}

export class SuspendUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class RejectListingDto {
  @ApiProperty({ example: 'Photos are insufficient or misleading.' })
  @IsString()
  reason: string;
}

export class UserListQueryDto {
  @ApiPropertyOptional({ enum: ['tenant', 'landlord', 'admin'] })
  @IsOptional()
  @IsEnum(['tenant', 'landlord', 'admin'])
  role?: string;

  @ApiPropertyOptional({ enum: ['unverified', 'documents_submitted', 'under_review', 'approved', 'rejected'] })
  @IsOptional()
  @IsEnum(['unverified', 'documents_submitted', 'under_review', 'approved', 'rejected'])
  verificationStatus?: string;

  @ApiPropertyOptional({ example: 'john', description: 'Search by name or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
