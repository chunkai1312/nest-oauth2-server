import { Controller, Get } from '@nestjs/common';
import { OAuth2ServerAuthenticate, OAuth2ServerOAuth } from '../../../src';

@Controller('user')
export class UserController {
  @Get()
  @OAuth2ServerAuthenticate()
  user(@OAuth2ServerOAuth() oauth: any) {
    return oauth.token.user;
  }
}
