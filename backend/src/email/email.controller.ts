import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { EmailService } from './email.service';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  @Public()
  @ApiOperation({ summary: 'Send a test OTP email (dev only)' })
  async sendTest(@Body() body: { to: string }) {
    if (process.env.NODE_ENV === 'production') {
      return { error: 'Not available in production' };
    }
    await this.emailService.sendOTP(body.to, '123456', 'verify');
    return { ok: true, to: body.to };
  }
}
