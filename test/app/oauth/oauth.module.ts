import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthModel } from './oauth.model';

@Module({
  controllers: [OAuthController],
  providers: [OAuthModel],
  exports: [OAuthModel],
})
export class OAuthModule {}
