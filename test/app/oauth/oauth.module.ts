import * as path from 'path';
import * as nconf from 'nconf';
import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthModel } from './oauth.model';
import { NCONF_INSTANCE_TOKEN } from './constants';

@Module({
  controllers: [OAuthController],
  providers: [
    {
      provide: NCONF_INSTANCE_TOKEN,
      useValue: nconf.use('file', {
        file: path.resolve(__dirname, '../../fixtures/db.json'),
      }),
    },
    OAuthModel,
  ],
})
export class OAuthModule {}
