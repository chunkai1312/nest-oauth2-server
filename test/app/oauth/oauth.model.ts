import { Injectable } from '@nestjs/common';
import {
  AuthorizationCodeModel,
  AuthorizationCode,
  Client,
  User,
  Token,
  Falsey,
} from '@node-oauth/oauth2-server';

@Injectable()
export class OAuthModel implements AuthorizationCodeModel {
  private readonly db: any = {};

  constructor() {
    this.db = {
      // Here is a fast overview of what your db model should look like
      authorizationCode: {
        authorizationCode: '', // A string that contains the code
        expiresAt: new Date(), // A date when the code expires
        redirectUri: '', // A string of where to redirect to with this code
        client: null, // See the client section
        user: null, // Whatever you want... This is where you can be flexible with the protocol
      },
      client: {
        // Application wanting to authenticate with this server
        clientId: '', // Unique string representing the client
        clientSecret: '', // Secret of the client; Can be null
        grants: [], // Array of grants that the client can use (ie, `authorization_code`)
        redirectUris: [], // Array of urls the client is allowed to redirect to
      },
      token: {
        accessToken: '', // Access token that the server created
        accessTokenExpiresAt: new Date(), // Date the token expires
        client: null, // Client associated with this token
        user: null, // User associated with this token
      },
    };
  }

  async getClient(
    clientId: string,
    clientSecret: string,
  ): Promise<Client | Falsey> {
    this.db.client = {
      id: clientId,
      grants: ['authorization_code', 'refresh_token'],
      redirectUris: ['http://example.com'],
    };
    return this.db.client;
  }

  async saveToken(
    token: Token,
    client: Client,
    user: User,
  ): Promise<Token | Falsey> {
    this.db.token = {
      accessToken: 'foobar',
      client: client,
      user: user,
    };
    return this.db.token;
  }

  async getAccessToken(token: string): Promise<Token | Falsey> {
    const tokenExpires = new Date();
    tokenExpires.setDate(tokenExpires.getDate() + 1);

    this.db.token = {
      accessToken: 'foobar',
      accessTokenExpiresAt: tokenExpires,
      client: { id: '12345' },
      user: {},
    };
    return this.db.token;
  }

  async saveAuthorizationCode(
    code: AuthorizationCode,
    client: Client,
    user: User,
  ) {
    this.db.authorizationCode = {
      authorizationCode: '123',
      expiresAt: code.expiresAt,
      client: client,
      user: user,
    };
    return this.db.authorizationCode;
  }

  async getAuthorizationCode(
    authorizationCode: string,
  ): Promise<AuthorizationCode | Falsey> {
    const codeExpires = new Date();
    codeExpires.setDate(codeExpires.getDate() + 1);

    this.db.authorizationCode = {
      authorizationCode: '123',
      expiresAt: new Date(Date.now() + 3600),
      client: { id: '12345' },
      user: {},
    };
    return this.db.authorizationCode;
  }

  async revokeAuthorizationCode(code: AuthorizationCode): Promise<boolean> {
    this.db.authorizationCode = {
      authorizationCode: '',
      expiresAt: new Date(),
      redirectUri: '',
      client: null,
      user: null,
    };
    return true;
  }

  async verifyScope(token: Token, scope: string | string[]): Promise<boolean> {
    return true;
  }
}
