import * as OAuth2Server from 'oauth2-server';
import { UseGuards, SetMetadata, applyDecorators } from '@nestjs/common';
import { OAuthTokenGuard } from '../guards';
import { OAUTH2_SERVER_HANDLER_OPTIONS_METADATA } from '../oauth2-server.constants';

export function OAuthToken(options: OAuth2Server.TokenOptions = {}): ClassDecorator & MethodDecorator {
  return applyDecorators(
    SetMetadata(OAUTH2_SERVER_HANDLER_OPTIONS_METADATA, options),
    UseGuards(OAuthTokenGuard),
  );
}
