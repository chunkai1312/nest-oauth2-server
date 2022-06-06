import { Controller, Get, Post } from '@nestjs/common';
import { OAuth2ServerAuthenticate, OAuth2ServerAuthorize, OAuth2ServerToken, OAuth2ServerOAuth } from '../../../src';

@Controller('oauth')
export class OAuthController {
  @Get('user')
  @OAuth2ServerAuthenticate()
  user(@OAuth2ServerOAuth() oauth: any) {
    return oauth.token.user;
  }

  @Post('authorize')
  @OAuth2ServerAuthorize()
  authorize() {}

  @Post('token')
  @OAuth2ServerToken()
  token() {}
}
