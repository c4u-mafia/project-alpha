import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import { AdminService } from './admin.service';
import {
  RejectKycDocumentDto,
  ReviewKycDocumentDto,
  SuspendUserDto,
  UserListQueryDto,
  RejectListingDto,
} from './dto/admin.dto';

@ApiTags('admin')
@ApiBearerAuth('bearer')
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  // ── KYC queue ──────────────────────────────────────────────────────────────

  @Get('kyc-queue')
  @ApiOperation({
    summary: 'List all KYC docs with status submitted or under_review',
  })
  getKycQueue() {
    return this.service.getKycQueue();
  }

  @Patch('kyc-documents/:id/review')
  @ApiOperation({ summary: 'Move KYC document to under_review' })
  markUnderReview(
    @Param('id') id: string,
    @CurrentUser() user: SessionUser,
    @Body() dto: ReviewKycDocumentDto,
  ) {
    return this.service.markUnderReview(id, user.id, dto);
  }

  @Patch('kyc-documents/:id/approve')
  @ApiOperation({
    summary:
      'Approve KYC document — auto-promotes landlord when all docs approved',
  })
  approveKycDocument(
    @Param('id') id: string,
    @CurrentUser() user: SessionUser,
  ) {
    return this.service.approveKycDocument(id, user.id);
  }

  @Patch('kyc-documents/:id/reject')
  @ApiOperation({ summary: 'Reject KYC document with a reason' })
  rejectKycDocument(
    @Param('id') id: string,
    @CurrentUser() user: SessionUser,
    @Body() dto: RejectKycDocumentDto,
  ) {
    return this.service.rejectKycDocument(id, user.id, dto);
  }

  // ── User management ────────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({
    summary: 'List users — filterable by role, verificationStatus, search term',
  })
  listUsers(@Query() query: UserListQueryDto) {
    return this.service.listUsers(query);
  }

  @Patch('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend a user account' })
  suspendUser(@Param('id') id: string, @Body() dto: SuspendUserDto) {
    return this.service.suspendUser(id, dto);
  }

  @Patch('users/:id/ban')
  @ApiOperation({ summary: 'Ban a user account permanently' })
  banUser(@Param('id') id: string) {
    return this.service.banUser(id);
  }

  @Patch('users/:id/activate')
  @ApiOperation({ summary: 'Restore a suspended account to active status' })
  activateUser(@Param('id') id: string) {
    return this.service.activateUser(id);
  }

  // ── Listing moderation ─────────────────────────────────────────────────────

  @Get('listings-queue')
  @ApiOperation({ summary: 'List properties with status submitted_for_review' })
  getListingsQueue() {
    return this.service.getListingsQueue();
  }

  @Patch('listings/:id/approve')
  @ApiOperation({
    summary: 'Approve a listing — sets status to listed and stamps publishedAt',
  })
  approveListing(@Param('id') id: string) {
    return this.service.approveListing(id);
  }

  @Patch('listings/:id/reject')
  @ApiOperation({ summary: 'Reject a listing with a reason' })
  rejectListing(@Param('id') id: string, @Body() dto: RejectListingDto) {
    return this.service.rejectListing(id, dto);
  }
}
