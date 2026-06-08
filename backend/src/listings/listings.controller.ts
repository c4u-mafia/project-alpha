import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import { ListingsService } from './listings.service';
import { ListingsQueryDto } from './dto/listings.dto';

@ApiTags('listings')
@ApiBearerAuth('bearer')
@Controller()
export class ListingsController {
  constructor(private readonly service: ListingsService) {}

  @Get('feed')
  @Roles('tenant')
  @ApiOperation({ summary: 'Curated home feed sections: For You, New This Week, Verified Only' })
  getFeed(@CurrentUser() user: SessionUser) {
    return this.service.getFeed(user.id);
  }

  @Get('listings')
  @Roles('tenant')
  @ApiOperation({ summary: 'Search and filter listed properties (address hidden)' })
  search(@Query() query: ListingsQueryDto) {
    return this.service.search(query);
  }

  @Get('listings/:id')
  @Roles('tenant')
  @ApiOperation({ summary: 'Get listing detail — address replaced with area only' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post('listings/:id/save')
  @Roles('tenant')
  @ApiOperation({ summary: 'Save / favourite a listing' })
  save(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.save(user.id, id);
  }

  @Delete('listings/:id/save')
  @Roles('tenant')
  @ApiOperation({ summary: 'Remove a listing from saved' })
  unsave(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.unsave(user.id, id);
  }

  @Get('me/saved-listings')
  @Roles('tenant')
  @ApiOperation({ summary: "Tenant's saved listings" })
  getSavedListings(@CurrentUser() user: SessionUser) {
    return this.service.getSavedListings(user.id);
  }
}
