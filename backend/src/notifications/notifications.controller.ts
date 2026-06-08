import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth('bearer')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated notifications for the current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @CurrentUser() user: SessionUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAllForUser(user.id, Number(page ?? 1), Number(limit ?? 20));
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a single notification as read' })
  markRead(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.markRead(id, user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@CurrentUser() user: SessionUser) {
    return this.service.markAllRead(user.id);
  }
}
