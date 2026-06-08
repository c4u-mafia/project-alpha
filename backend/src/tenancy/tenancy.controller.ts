import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import { TenancyService } from './tenancy.service';

@ApiTags('tenancy')
@ApiBearerAuth('bearer')
@Controller()
export class TenancyController {
  constructor(private readonly service: TenancyService) {}

  @Get('tenancy/current')
  @Roles('tenant')
  @ApiOperation({ summary: "Tenant's active tenancy — rent health %, days remaining" })
  getCurrent(@CurrentUser() user: SessionUser) {
    return this.service.getCurrentTenancy(user.id);
  }

  @Get('tenancy/:id')
  @ApiOperation({ summary: 'Full tenancy detail (tenant or landlord of that property)' })
  findOne(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.findOne(id, user.id);
  }

  @Get('tenancy/:id/payments')
  @ApiOperation({ summary: 'Payment history for a specific tenancy' })
  getPayments(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.getTenancyPayments(id, user.id);
  }

  @Post('tenancy/:id/renew')
  @Roles('tenant')
  @ApiOperation({ summary: 'Tenant initiates renewal — creates a new payment link' })
  renew(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.initiateRenewal(id, user.id);
  }

  @Get('landlord/tenants')
  @Roles('landlord')
  @ApiOperation({ summary: "Landlord's tenants with rent health bars, sorted by expiry" })
  getLandlordTenants(@CurrentUser() user: SessionUser) {
    return this.service.getLandlordTenants(user.id);
  }
}
