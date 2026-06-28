import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, DeclineApplicationDto } from './dto/applications.dto';

@ApiTags('applications')
@ApiBearerAuth('bearer')
@Controller()
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  @Post('applications')
  @Roles('tenant')
  @ApiOperation({ summary: 'Tenant submits a rental application (requires completed viewing)' })
  create(@CurrentUser() user: SessionUser, @Body() dto: CreateApplicationDto) {
    return this.service.create(user.id, dto);
  }

  @Get('applications/mine')
  @Roles('tenant')
  @ApiOperation({ summary: "Tenant's applications with statuses" })
  getMine(@CurrentUser() user: SessionUser) {
    return this.service.getMyApplications(user.id);
  }

  @Get('properties/:propertyId/applications')
  @Roles('landlord')
  @ApiOperation({ summary: 'Landlord sees all applications for a property' })
  getPropertyApplications(
    @CurrentUser() user: SessionUser,
    @Param('propertyId') propertyId: string,
  ) {
    return this.service.getPropertyApplications(user.id, propertyId);
  }

  @Get('landlord/applications')
  @Roles('landlord')
  @ApiOperation({ summary: 'Landlord: all applications across every owned property' })
  getAllLandlordApplications(@CurrentUser() user: SessionUser) {
    return this.service.getLandlordApplications(user.id);
  }

  @Get('applications/:id')
  @ApiOperation({ summary: 'Single application detail (tenant or landlord of that property)' })
  findOne(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.findOne(id, user.id);
  }

  @Patch('applications/:id/approve')
  @Roles('landlord')
  @ApiOperation({ summary: 'Landlord approves application and generates draft lease' })
  approve(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.approve(id, user.id);
  }

  @Patch('applications/:id/decline')
  @Roles('landlord')
  @ApiOperation({ summary: 'Landlord declines application with optional note' })
  decline(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Body() dto: DeclineApplicationDto,
  ) {
    return this.service.decline(id, user.id, dto);
  }

  @Get('leases/:id')
  @ApiOperation({ summary: 'View lease (tenant or landlord who owns the property)' })
  getLease(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.getLease(id, user.id);
  }

  @Post('leases/:id/sign')
  @ApiOperation({ summary: 'Sign lease — both parties must sign to activate tenancy' })
  signLease(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.signLease(id, user.id);
  }
}
