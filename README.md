# nest-oauth2-server

Complete, compliant and well tested module for implementing an OAuth2 Server/Provider with [nest](https://github.com/nestjs/nest) in [node.js](http://nodejs.org/).

This is the nest wrapper for [oauth2-server](https://github.com/oauthjs/node-oauth2-server).

## Installation

To begin using it, we first install the required dependencies.

```bash
$ npm install --save nest-oauth2-server oauth2-server
$ npm install --save-dev @types/oauth2-server
```

## Quick Start

Once the installation process is complete, we can import the `OAuth2ServerModule` into the root `AppModule`.

```typescript
import { Module } from '@nestjs/common';
import { OAuth2ServerModule } from 'nest-oauth2-server';
import { OAuthModel } from './oauth.model';

@Module({
  imports: [
    OAuth2ServerModule.forRoot({
      allowBearerTokensInQueryString: true,
      accessTokenLifetime: 4 * 60 * 60,
    }),
  ],
  providers: [OAuthModel],
})
export class AppModule {}
```

The `forRoot()` method accepts the same configuration object to create a new [OAuth2Server](https://oauth2-server.readthedocs.io/en/latest/api/oauth2-server.html#new-oauth2server-options) instance.

[OAuth2Server](https://oauth2-server.readthedocs.io/en/latest/api/oauth2-server.html) requires a [model](https://oauth2-server.readthedocs.io/en/latest/model/overview.html) object through which some aspects or storage, retrieval and custom validation are abstracted. In order to do that, you **MUST** declare the model with `@OAuth2ServerModel` decorator, which can be provided as a service from any part of your application.

```typescript
import { PasswordModel, Client, User, Token } from 'oauth2-server';

@OAuth2ServerModel()
export class OAuthModel implements PasswordModel {
  async getClient(clientId: string, clientSecret: string) {}
  async getUser(username: string, password: string) {}
  async saveToken(token: Token, client: Client, user: User) {}
  async getAccessToken(accessToken: string) {}
  async verifyScope(token: Token, scope: string | string[]) {}
}
```

> The [model specification](https://oauth2-server.readthedocs.io/en/latest/model/spec.html) see documentation for details.

The module provides decorators to help you create oauth2 handler endpoints. The following is an example controller for oauth2 server endpoints:

```typescript
import { Controller, All, Get } from '@nestjs/common';
import { OAuthAuthenticate, OAuthAuthorize, OAuthToken } from 'nest-oauth2-server';

@Controller('oauth')
export class OAuthController {
  @Get('user')
  @OAuthAuthenticate()
  user(@OAuth() oauth: any) {
    return oauth.token.user;
  }

  @Get('authorize')
  @OAuthAuthorize()
  authorize() {}

  @All('token')
  @OAuthToken()
  token() {}
}
```

## Async configuration

When you need to pass module options asynchronously instead of statically, use the `forRootAsync()` method. As with most dynamic modules, Nest provides several techniques to deal with async configuration.

One technique is to use a factory function:

```typescript
OAuth2ServerModule.forRootAsync({
  useFactory: () => ({
    allowBearerTokensInQueryString: true,
    accessTokenLifetime: 4 * 60 * 60,
  }),
});
```

Like other factory providers, our factory function can be [async](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory) and can inject dependencies through `inject`.

```typescript
OAuth2ServerModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    allowBearerTokensInQueryString: true,
    accessTokenLifetime: +configService.get<number>('ACCESS_TOKEN_LIFETIME'),
  }),
  inject: [ConfigService],
});
```

Alternatively, you can configure the `OAuth2ServerModule` using a class instead of a factory, as shown below.

```typescript
OAuth2ServerModule.forRootAsync({
  useClass: OAuth2ServerConfigService,
});
```

The construction above instantiates `OAuth2ServerConfigService` inside `OAuth2ServerModule`, using it to create an options object. Note that in this example, the `OAuth2ServerConfigService` has to implement `OAuth2ServerOptionsFactory` interface as shown below. The `OAuth2ServerModule` will call the `createOAuth2ServerOptions()` method on the instantiated object of the supplied class.

```typescript
@Injectable()
class OAuth2ServerConfigService implements OAuth2ServerOptionsFactory {
  createOAuth2ServerOptions(): OAuth2ServerModuleOptions {
    return {
      allowBearerTokensInQueryString: true,
      accessTokenLifetime: 4 * 60 * 60,
    };
  }
}
```

If you want to reuse an existing options provider instead of creating a private copy inside the `OAuth2ServerModule`, use the `useExisting` syntax.

```typescript
OAuth2ServerModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: OAuth2ServerConfigService,
});
```


## License

[MIT](LICENSE)
