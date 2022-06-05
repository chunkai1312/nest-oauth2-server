import { Injectable } from '@nestjs/common';
import { OAuth2ServerOptionsFactory, OAuth2ServerModuleOptions } from '../../../src';
import { OAuthModel } from './oauth.model';

@Injectable()
export class OAuthConfig implements OAuth2ServerOptionsFactory {
  constructor(private readonly model: OAuthModel) {}

  createOAuth2ServerOptions(): OAuth2ServerModuleOptions | Promise<OAuth2ServerModuleOptions> {
    return {
      model: this.model,
    };
  }
}
