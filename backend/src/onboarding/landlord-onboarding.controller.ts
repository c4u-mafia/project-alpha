import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import { LandlordOnboardingService } from './landlord-onboarding.service';
import {
  LandlordProfileDto,
  LandlordNinDto,
  LandlordDocumentDto,
  LandlordBankDto,
} from './dto/landlord-onboarding.dto';

@ApiTags('onboarding / landlord')
@ApiBearerAuth('bearer')
@Roles('landlord')
@Controller('onboarding/landlord')
export class LandlordOnboardingController {
  constructor(private readonly service: LandlordOnboardingService) {}

  @Post('profile')
  @ApiOperation({ summary: 'Save landlord profile (individual/company toggle, diaspora flag)' })
  saveProfile(@CurrentUser() user: SessionUser, @Body() dto: LandlordProfileDto) {
    return this.service.saveProfile(user.id, dto);
  }

  @Post('nin')
  @ApiOperation({ summary: 'Submit NIN — flips ninStatus to pending' })
  submitNin(@CurrentUser() user: SessionUser, @Body() dto: LandlordNinDto) {
    return this.service.submitNin(user.id, dto);
  }

  @Post('documents')
  @ApiOperation({
    summary: 'Submit a KYC document URL (C of O, deed, utility bill, etc.)',
    description:
      'Upload the file to storage first, then pass the URL here. Call once per document.',
  })
  uploadDocument(@CurrentUser() user: SessionUser, @Body() dto: LandlordDocumentDto) {
    return this.service.uploadDocument(user.id, dto);
  }

  @Post('bank')
  @ApiOperation({ summary: 'Save bank account for rent payouts' })
  saveBank(@CurrentUser() user: SessionUser, @Body() dto: LandlordBankDto) {
    return this.service.saveBank(user.id, dto);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get step-by-step onboarding completion for landlord' })
  getStatus(@CurrentUser() user: SessionUser) {
    return this.service.getStatus(user.id);
  }
}
