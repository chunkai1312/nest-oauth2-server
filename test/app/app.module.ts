import { Module } from '@nestjs/common';
import { OAuth2ServerModule } from '../../src';
import { OAuthModule } from './oauth/oauth.module';
import { OAuthConfig } from './oauth/oauth.config';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    OAuth2ServerModule.forRootAsync({
      imports: [OAuthModule],
      useExisting: OAuthConfig,
    }),
    OAuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
