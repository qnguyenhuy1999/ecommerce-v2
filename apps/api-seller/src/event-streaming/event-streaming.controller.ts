import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/guards/auth.guard'
import { EventStreamingService } from './event-streaming.service'
import { EmitEventDto } from './dto/event-streaming.dto'
import { OffsetPaginationDto } from '@ecom/pagination'

@Controller('events')
@UseGuards(AuthGuard)
export class EventStreamingController {
  constructor(private readonly eventStreamingService: EventStreamingService) {}

  @Post()
  async emitEvent(@Body() dto: EmitEventDto) {
    return this.eventStreamingService.emitEvent(dto)
  }

  @Get()
  async listEvents(@Query() query: OffsetPaginationDto & { eventType?: string; source?: string }) {
    return this.eventStreamingService.listEvents(query)
  }

  @Get('stats')
  async getStats() {
    return this.eventStreamingService.getEventStats()
  }

  @Get(':id')
  async getEvent(@Param('id') id: string) {
    return this.eventStreamingService.getEventById(id)
  }

  @Post(':id/replay')
  async replayEvent(@Param('id') id: string) {
    return this.eventStreamingService.replayEvent(id)
  }
}
