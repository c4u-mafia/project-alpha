import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateSlotDto {
  @ApiProperty({ example: '2026-07-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '10:30' })
  @IsString()
  endTime: string;

  @ApiPropertyOptional({ example: 3, description: 'Max attendees per slot (default 1)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttendees?: number;
}

export class CreateViewingRequestDto {
  @ApiProperty({ description: 'Viewing slot ID' })
  @IsString()
  slotId: string;

  @ApiPropertyOptional({ example: 'Looking forward to the viewing!' })
  @IsOptional()
  @IsString()
  tenantMessage?: string;
}

export class RateViewingDto {
  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Very professional and on time.' })
  @IsOptional()
  @IsString()
  note?: string;
}
