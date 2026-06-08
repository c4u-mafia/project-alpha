import { Module } from '@nestjs/common';
import { TenancyController } from './tenancy.controller';
import { TenancyService } from './tenancy.service';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PaymentsModule],
  controllers: [TenancyController],
  providers: [TenancyService],
})
export class TenancyModule {}
