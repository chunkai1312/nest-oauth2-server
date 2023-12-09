import * as OAuth2Server from '@node-oauth/oauth2-server';
import { UseGuards, SetMetadata, applyDecorators } from '@nestjs/common';
import { OAuth2ServerAuthorizeGuard } from '../guards';
import { OAUTH2_SERVER_OPTIONS_METADATA } from '../oauth2-server.constants';

export function OAuth2ServerAuthorize(
  options: OAuth2Server.AuthorizeOptions = {},
): ClassDecorator & MethodDecorator {
  return applyDecorators(
    SetMetadata(OAUTH2_SERVER_OPTIONS_METADATA, options),
    UseGuards(OAuth2ServerAuthorizeGuard),
  );
}
