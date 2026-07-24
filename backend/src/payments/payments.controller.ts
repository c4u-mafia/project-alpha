import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import { PaymentsService } from './payments.service';
import {
  FundWalletDto,
  InitializePaymentDto,
  ReleaseEscrowDto,
  WithdrawDto,
} from './dto/payments.dto';

@ApiTags('payments')
@ApiBearerAuth('bearer')
@Controller()
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  // ── Wallet ────────────────────────────────────────────────────────────────

  @Get('wallet')
  @ApiOperation({
    summary: 'Get current wallet balance and recent transactions',
  })
  getWallet(@CurrentUser() user: SessionUser) {
    return this.service.getWallet(user.id);
  }

  @Post('wallet/fund')
  @Roles('tenant')
  @ApiOperation({
    summary:
      'Initialize wallet top-up via Paystack (returns payment reference)',
  })
  fundWallet(@CurrentUser() user: SessionUser, @Body() dto: FundWalletDto) {
    return this.service.fundWallet(user.id, dto);
  }

  @Post('wallet/withdraw')
  @Roles('landlord')
  @ApiOperation({ summary: 'Landlord requests payout to their bank account' })
  withdraw(@CurrentUser() user: SessionUser, @Body() dto: WithdrawDto) {
    return this.service.requestWithdrawal(user.id, dto);
  }

  // ── Payments ──────────────────────────────────────────────────────────────

  @Post('payments/initialize')
  @Roles('tenant')
  @ApiOperation({
    summary: 'Initialize rent payment (returns payment reference)',
  })
  initializePayment(
    @CurrentUser() user: SessionUser,
    @Body() dto: InitializePaymentDto,
  ) {
    return this.service.initializeRentPayment(user.id, dto);
  }

  @Post('payments/webhook')
  @Public()
  @ApiOperation({
    summary:
      'Paystack webhook — verifies signature, updates payment, creates escrow',
  })
  handleWebhook(
    @Body() body: Record<string, unknown>,
    @Headers('x-paystack-signature') signature?: string,
  ) {
    return this.service.handleWebhook(body, signature);
  }

  @Get('payments/history')
  @ApiOperation({ summary: 'Paginated payment history for current user' })
  getHistory(
    @CurrentUser() user: SessionUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getPaymentHistory(
      user.id,
      Number(page ?? 1),
      Number(limit ?? 20),
    );
  }

  // ── Admin: escrow ─────────────────────────────────────────────────────────

  @Get('admin/escrow')
  @Roles('admin')
  @ApiOperation({ summary: 'Admin: list all escrow holds' })
  getEscrow() {
    return this.service.getEscrowHolds();
  }

  @Patch('admin/escrow/:id/release')
  @Roles('admin')
  @ApiOperation({
    summary: 'Admin: manual early release of escrow to landlord wallet',
  })
  releaseEscrow(@Param('id') id: string, @Body() dto: ReleaseEscrowDto) {
    return this.service.releaseEscrow(id, dto);
  }
}
