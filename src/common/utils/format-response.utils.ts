import type { JsonPaginatedResponseDto } from '../dto/json-paginated-response.dto';

export function FormatJsonPaginatedResponse<T>(
  message = 'Data retrieved successfully',
  data?: T,
  total?: number,
  page?: number,
  limit?: number,
): JsonPaginatedResponseDto<T> {
  const ret = {
    message,
    data,
    total,
    page,
    limit,
  };

  if (total && limit) {
    return {
      ...ret,
      totalPages: total && limit ? Math.ceil(total / limit) : null,
    };
  } else {
    return ret;
  }
}
