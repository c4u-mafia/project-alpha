import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ description: 'Listed property to ask the landlord about' })
  @IsString()
  propertyId: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'Hello, is this property still available?' })
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  content: string;
}

export class MessageListQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 50, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 50;
}
