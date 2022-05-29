import { Controller, All } from '@nestjs/common';
import { OAuthToken } from '../../../src';

@Controller('oauth')
export class OAuthController {
  @All('token')
  @OAuthToken({})
  token() {}
}
