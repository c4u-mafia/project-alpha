import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import {
  CreateConversationDto,
  MessageListQueryDto,
  SendMessageDto,
} from './dto/messages.dto';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@ApiBearerAuth('bearer')
@Controller('conversations')
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Post()
  @Roles('tenant')
  @ApiOperation({
    summary: 'Start or return the conversation for a listed property',
  })
  create(@CurrentUser() user: SessionUser, @Body() dto: CreateConversationDto) {
    return this.service.createConversation(user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List the current user’s conversations, newest first',
  })
  findAll(@CurrentUser() user: SessionUser) {
    return this.service.getConversations(user.id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get paginated messages in a conversation' })
  getMessages(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Query() query: MessageListQueryDto,
  ) {
    return this.service.getMessages(id, user.id, query);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message as either participant' })
  send(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.service.sendMessage(id, user.id, dto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark messages from the other participant as read' })
  markRead(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.markRead(id, user.id);
  }
}
