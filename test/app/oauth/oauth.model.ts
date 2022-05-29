import { Inject } from '@nestjs/common';
import { OAuth2ServerModel } from '../../../src';
import { PasswordModel, Client, User, Token } from 'oauth2-server';
import { Provider } from 'nconf';
import { NCONF_INSTANCE_TOKEN } from './constants';

@OAuth2ServerModel()
export class OAuthModel implements PasswordModel {
  constructor(
    @Inject(NCONF_INSTANCE_TOKEN)
    private readonly nconf: Provider,
  ) {}

  async verifyScope(token: Token, scope: string | string[]) {
    return true;
  }

  async getClient(clientId: string, clientSecret: string) {
    const client = this.nconf.get('client');
    if (clientId !== client.clientId || clientSecret !== client.clientSecret) {
      return;
    }
    return client;
  }

  async getUser(username: string, password: string) {
    const user = this.nconf.get('user');
    if (username !== user.username || password !== user.password) {
      return;
    }
    return { userId: user.id };
  }

  async getAccessToken(bearerToken: string) {
    const token = this.nconf.get('token');
    if (bearerToken !== token.accessToken) {
      return;
    }
    token.accessTokenExpiresAt = new Date(token.accessTokenExpiresAt);
    token.refreshTokenExpiresAt = new Date(token.refreshTokenExpiresAt);
    const user = this.nconf.get('user');
    const client = this.nconf.get('client');
    token.user = user;
    token.client = client;
    return token;
  }

  async saveToken(token: Token, client: Client, user: User) {
    return { ...token, client, user };
  }
}
