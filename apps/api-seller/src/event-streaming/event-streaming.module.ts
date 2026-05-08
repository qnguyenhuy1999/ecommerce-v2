import { Module } from '@nestjs/common'
import { EventStreamingController } from './event-streaming.controller'
import { EventStreamingService } from './event-streaming.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [EventStreamingController],
  providers: [EventStreamingService],
  exports: [EventStreamingService],
})
export class EventStreamingModule {}
