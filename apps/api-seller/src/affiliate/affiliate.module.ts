import { Module } from '@nestjs/common'
import { AffiliateController } from './affiliate.controller'
import { AffiliateService } from './affiliate.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [AffiliateController],
  providers: [AffiliateService],
  exports: [AffiliateService],
})
export class AffiliateModule {}
