import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class InitializePaymentDto {
  @ApiProperty({ description: 'Tenancy ID this payment is for' })
  @IsString()
  tenancyId: string;

  @ApiProperty({ example: 120000000, description: 'Amount in kobo' })
  @IsInt()
  @Min(100)
  amount: number;
}

export class FundWalletDto {
  @ApiProperty({ example: 50000000, description: 'Amount to fund in kobo' })
  @IsInt()
  @Min(100)
  amount: number;
}

export class WithdrawDto {
  @ApiProperty({ example: 50000000, description: 'Amount to withdraw in kobo' })
  @IsInt()
  @Min(100)
  amount: number;
}

export class ReleaseEscrowDto {
  @ApiPropertyOptional({ example: 'Early release approved by tenant.' })
  @IsOptional()
  @IsString()
  reason?: string;
}
