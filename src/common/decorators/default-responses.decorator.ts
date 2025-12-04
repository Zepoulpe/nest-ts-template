import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';

export const DefaultResponses = {
  Created: (status: number) =>
    status === 201
      ? ApiCreatedResponse({ description: 'Created' })
      : ApiOkResponse({ description: 'OK' }),
  BadRequest: () => ApiResponse({ status: 400, description: 'Bad request' }),
  Unauthorized: () => ApiResponse({ status: 401, description: 'Unauthorized' }),
  Forbidden: () => ApiResponse({ status: 403, description: 'Forbidden' }),
  NotFound: () => ApiResponse({ status: 404, description: 'Not Found' }),
  InternalServerError: () => ApiResponse({ status: 500, description: 'Internal Server Error' }),
  NoContent: () =>
    ApiNoContentResponse({
      description: 'Resource deleted successfully, no content returned',
    }),
};

export function DefaultRestResponses(status: number) {
  const decorators = [
    DefaultResponses.BadRequest(),
    DefaultResponses.Unauthorized(),
    DefaultResponses.Forbidden(),
    DefaultResponses.NotFound(),
    DefaultResponses.InternalServerError(),
  ];

  decorators.unshift(
    status === 204 ? DefaultResponses.NoContent() : DefaultResponses.Created(status),
  );

  return applyDecorators(...decorators);
}
