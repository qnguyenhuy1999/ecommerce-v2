import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/guards/auth.guard'
import {
  ApiOkResponseData,
  ApiCreatedResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'
import { EventStreamingService } from './event-streaming.service'
import { EmitEventDto } from './dto/event-streaming.dto'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@ApiTags('Seller/Events')
@ApiAuth()
@ApiErrorResponses()
@Controller('events')
@UseGuards(AuthGuard)
export class EventStreamingController {
  constructor(private readonly eventStreamingService: EventStreamingService) {}

  @Post()
  @ApiCreatedResponseData(Object)
  async emitEvent(@Body() dto: EmitEventDto) {
    return this.eventStreamingService.emitEvent(dto)
  }

  @Get()
  @ApiPaginatedResponse(Object)
  async listEvents(@Query() query: OffsetPaginationDto & { eventType?: string; source?: string }) {
    return this.eventStreamingService.listEvents(query)
  }

  @Get('stats')
  @ApiOkResponseData(Object)
  async getStats() {
    return this.eventStreamingService.getEventStats()
  }

  @Get(':id')
  @ApiOkResponseData(Object)
  async getEvent(@Param('id') id: string) {
    return this.eventStreamingService.getEventById(id)
  }

  @Post(':id/replay')
  @ApiOkResponseData(Object)
  async replayEvent(@Param('id') id: string) {
    return this.eventStreamingService.replayEvent(id)
  }
}
