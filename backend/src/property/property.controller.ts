import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import { PropertyService } from './property.service';
import { AddPhotoDto, CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';

@ApiTags('properties')
@ApiBearerAuth('bearer')
@Roles('landlord')
@Controller('properties')
export class PropertyController {
  constructor(private readonly service: PropertyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a property in draft status (verified landlord only)' })
  create(@CurrentUser() user: SessionUser, @Body() dto: CreatePropertyDto) {
    return this.service.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "List landlord's own properties (all statuses)" })
  findAll(@CurrentUser() user: SessionUser) {
    return this.service.findAllForLandlord(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full property detail including private address (landlord view)' })
  findOne(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.findOneForLandlord(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update property details (not allowed when occupied)' })
  update(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.service.update(id, user.id, dto);
  }

  @Post(':id/photos')
  @ApiOperation({ summary: 'Add a photo URL to the property (min 6 required to submit)' })
  addPhoto(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Body() dto: AddPhotoDto,
  ) {
    return this.service.addPhoto(id, user.id, dto);
  }

  @Delete(':id/photos/:photoId')
  @ApiOperation({ summary: 'Remove a photo from the property' })
  deletePhoto(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Param('photoId') photoId: string,
  ) {
    return this.service.deletePhoto(id, photoId, user.id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit property for admin review (requires 6+ photos, draft status)' })
  submit(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.submitForReview(id, user.id);
  }

  @Patch(':id/pause')
  @ApiOperation({ summary: 'Pause a listed property' })
  pause(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.pause(id, user.id);
  }

  @Patch(':id/unpause')
  @ApiOperation({ summary: 'Unpause a paused property back to listed' })
  unpause(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.unpause(id, user.id);
  }
}
