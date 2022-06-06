import { Module } from '@nestjs/common';
import { OAuth2ServerModule } from '../../src';
import { OAuthModule } from './oauth/oauth.module';
import { OAuthModel } from './oauth/oauth.model';

@Module({
  imports: [
    OAuth2ServerModule.forRootAsync({
      imports: [OAuthModule],
      useFactory: (model: OAuthModel) => ({
        model: model,
      }),
      inject: [OAuthModel],
    }),
    OAuthModule,
  ],
})
export class AppModule {}
