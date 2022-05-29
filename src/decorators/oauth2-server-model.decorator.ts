import { SetMetadata } from '@nestjs/common';
import { OAUTH2_SERVER_MODEL_METADATA } from '../oauth2-server.constants';

export const OAuth2ServerModel = (): ClassDecorator =>
  SetMetadata(OAUTH2_SERVER_MODEL_METADATA, {});
