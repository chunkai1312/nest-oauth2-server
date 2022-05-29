import * as OAuth2Server from 'oauth2-server';
import { UseGuards, SetMetadata, applyDecorators } from '@nestjs/common';
import { OAUTH2_SERVER_HANDLER_OPTIONS_METADATA } from '../oauth2-server.constants';

export function OAuthAuthorize(options: OAuth2Server.AuthorizeOptions = {}): ClassDecorator & MethodDecorator {
  return applyDecorators(
    SetMetadata(OAUTH2_SERVER_HANDLER_OPTIONS_METADATA, options),
    UseGuards(OAuthAuthorize),
  );
}
