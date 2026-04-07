import { ApiProperty } from '@nestjs/swagger';

export class JsonResponseDto<T> {
  @ApiProperty({
    description: 'Number of element, if data is a list',
    example: 1,
  })
  count?: number;

  @ApiProperty({
    description: 'message',
    example: 'Entities has been retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'data',
    isArray: true,
  })
  data: T;
}
