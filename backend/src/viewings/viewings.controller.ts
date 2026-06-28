import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import { ViewingsService } from './viewings.service';
import { CreateSlotDto, CreateViewingRequestDto, RateViewingDto } from './dto/viewings.dto';

@ApiTags('viewings')
@ApiBearerAuth('bearer')
@Controller()
export class ViewingsController {
  constructor(private readonly service: ViewingsService) {}

  // ── Landlord: manage slots ──────────────────────────────────────────────────

  @Post('properties/:propertyId/viewing-slots')
  @Roles('landlord')
  @ApiOperation({ summary: 'Landlord adds available viewing slot to a property' })
  createSlot(
    @CurrentUser() user: SessionUser,
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateSlotDto,
  ) {
    return this.service.createSlot(user.id, propertyId, dto);
  }

  @Delete('properties/:propertyId/viewing-slots/:slotId')
  @Roles('landlord')
  @ApiOperation({ summary: 'Landlord removes a viewing slot' })
  deleteSlot(
    @CurrentUser() user: SessionUser,
    @Param('propertyId') propertyId: string,
    @Param('slotId') slotId: string,
  ) {
    return this.service.deleteSlot(user.id, propertyId, slotId);
  }

  @Get('properties/:propertyId/viewing-requests')
  @Roles('landlord')
  @ApiOperation({ summary: 'Landlord sees all viewing requests for a property' })
  getPropertyRequests(
    @CurrentUser() user: SessionUser,
    @Param('propertyId') propertyId: string,
  ) {
    return this.service.getPropertyRequests(user.id, propertyId);
  }

  @Get('landlord/viewing-requests')
  @Roles('landlord')
  @ApiOperation({ summary: 'Landlord: all viewing requests across every owned property' })
  getAllLandlordRequests(@CurrentUser() user: SessionUser) {
    return this.service.getLandlordRequests(user.id);
  }

  // ── Tenant: browse slots and request ────────────────────────────────────────

  @Get('listings/:propertyId/viewing-slots')
  @Roles('tenant')
  @ApiOperation({ summary: 'Tenant: get available viewing slots for a listing' })
  getSlots(@Param('propertyId') propertyId: string) {
    return this.service.getSlots(propertyId);
  }

  @Post('listings/:propertyId/viewing-requests')
  @Roles('tenant')
  @ApiOperation({ summary: 'Tenant requests a viewing slot' })
  createRequest(
    @CurrentUser() user: SessionUser,
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateViewingRequestDto,
  ) {
    return this.service.createRequest(user.id, propertyId, dto);
  }

  @Get('viewings/mine')
  @Roles('tenant')
  @ApiOperation({ summary: "Tenant's own viewing requests and statuses" })
  getMyRequests(@CurrentUser() user: SessionUser) {
    return this.service.getMyRequests(user.id);
  }

  // ── State transitions (landlord confirms/completes, either cancels) ──────────

  @Patch('viewings/:id/confirm')
  @Roles('landlord')
  @ApiOperation({ summary: 'Landlord confirms viewing — reveals full address to tenant' })
  confirm(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.confirm(id, user.id);
  }

  @Patch('viewings/:id/cancel')
  @ApiOperation({ summary: 'Either party cancels a viewing' })
  cancel(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.cancel(id, user.id);
  }

  @Patch('viewings/:id/complete')
  @Roles('landlord')
  @ApiOperation({ summary: 'Landlord marks viewing done — unlocks Apply CTA for tenant' })
  complete(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.complete(id, user.id);
  }

  @Post('viewings/:id/rate')
  @ApiOperation({ summary: 'Post-viewing rating (1–5 + note) from either party' })
  rate(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Body() dto: RateViewingDto,
  ) {
    return this.service.rate(id, user.id, dto);
  }
}
