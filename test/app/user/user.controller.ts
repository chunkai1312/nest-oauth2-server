import { Controller, Get } from '@nestjs/common';
import { OAuthAuthenticate, OAuth } from '../../../src';

@Controller('user')
export class UserController {
  @Get()
  @OAuthAuthenticate()
  user(@OAuth() oauth: any) {
    return oauth.token.user;
  }
}
