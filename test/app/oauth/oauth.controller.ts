import { Controller, All } from '@nestjs/common';
import { OAuth2ServerToken } from '../../../src';

@Controller('oauth')
export class OAuthController {
  @All('token')
  @OAuth2ServerToken({})
  token() {}
}
