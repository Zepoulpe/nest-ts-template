import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { DefaultRestResponses } from '@common/decorators/default-responses.decorator';

@Controller('status')
export class HealthController {
  @ApiOperation({ summary: 'Get health status' })
  @HttpCode(200)
  @DefaultRestResponses(200)
  @Get()
  getStatus() {
    return { status: 'OK', timestamp: Date.now() };
  }
}
