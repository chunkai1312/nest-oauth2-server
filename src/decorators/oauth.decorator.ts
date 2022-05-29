import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const OAuth = createParamDecorator((data: unknown, context: ExecutionContext) =>
  context.switchToHttp().getResponse().locals.oauth,
);
