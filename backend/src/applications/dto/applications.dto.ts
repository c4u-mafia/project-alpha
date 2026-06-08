import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ description: 'Property ID to apply for' })
  @IsString()
  propertyId: string;

  @ApiPropertyOptional({ description: 'Completed viewing request ID (required)' })
  @IsOptional()
  @IsString()
  viewingRequestId?: string;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  moveInDate: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/payslip.pdf' })
  @IsOptional()
  @IsString()
  employmentProofUrl?: string;

  @ApiPropertyOptional({ example: 'I am a quiet professional and will take great care of the property.' })
  @IsOptional()
  @IsString()
  personalMessage?: string;
}

export class DeclineApplicationDto {
  @ApiPropertyOptional({ example: 'Another applicant was selected.' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class SignLeaseDto {
  // Nothing extra needed — the actor's identity comes from the JWT
}
