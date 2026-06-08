import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import { SponsorshipService } from './sponsorship.service';
import { ContributeDto, CreateRentGoalDto } from './dto/sponsorship.dto';

@ApiTags('sponsorship')
@ApiBearerAuth('bearer')
@Controller('sponsorships')
export class SponsorshipController {
  constructor(private readonly service: SponsorshipService) {}

  @Post('goals')
  @Roles('tenant')
  @ApiOperation({ summary: 'Tenant creates a rent goal with target, deadline, and message' })
  createGoal(@CurrentUser() user: SessionUser, @Body() dto: CreateRentGoalDto) {
    return this.service.createGoal(user.id, dto);
  }

  @Get('goals/mine')
  @Roles('tenant')
  @ApiOperation({ summary: "Tenant's own rent goals" })
  getMyGoals(@CurrentUser() user: SessionUser) {
    return this.service.getMyGoals(user.id);
  }

  @Get('goals/:token')
  @Public()
  @ApiOperation({ summary: 'Public rent goal page — no auth required (share link)' })
  getByToken(@Param('token') token: string) {
    return this.service.getByToken(token);
  }

  @Post('goals/:token/contribute')
  @Public()
  @ApiOperation({
    summary: 'Contribute to a rent goal — guest (no auth) or authenticated user',
  })
  contribute(
    @Param('token') token: string,
    @Body() dto: ContributeDto,
    @CurrentUser() user?: SessionUser,
  ) {
    return this.service.contribute(token, dto, user?.id);
  }

  @Get('goals/:id/contributors')
  @Roles('tenant')
  @ApiOperation({ summary: "Tenant sees contributors list (anonymous entries respected)" })
  getContributors(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.service.getContributors(id, user.id);
  }
}
