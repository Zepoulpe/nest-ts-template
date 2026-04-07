import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JsonResponseDto } from './json-response.dto';

export class JsonPaginatedResponseDto<T> extends JsonResponseDto<T> {
  @ApiProperty({ description: '', example: 150 })
  total?: number;

  @ApiProperty({ description: '', example: 1 })
  page?: number;

  @ApiProperty({ description: '', example: 10 })
  limit?: number;

  @ApiPropertyOptional({ description: '', example: 15 })
  totalPages?: number;
}
