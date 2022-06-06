# nest-oauth2-server

[![NPM version][npm-image]][npm-url]
[![Build Status][action-image]][action-url]

Complete, compliant and well tested module for implementing an OAuth2 server with [Nest](https://github.com/nestjs/nest) in [Node.js](https://nodejs.org).

This is the Nest module wrapper for [oauth2-server](https://github.com/oauthjs/node-oauth2-server).

## Installation

To begin using it, we first install the required dependencies.

```bash
$ npm install --save nest-oauth2-server oauth2-server
$ npm install --save-dev @types/oauth2-server
```

## Getting started

Once the installation process is complete, we can import the `OAuth2ServerModule` into the root `AppModule`.

```typescript
import { Module } from '@nestjs/common';
import { OAuth2ServerModule } from 'nest-oauth2-server';
import { model } from './model';

@Module({
  imports: [
    OAuth2ServerModule.forRoot({
      model: model
    }),
  ],
})
export class AppModule {}
```

The `forRoot()` method accepts the same configuration object to create a new [OAuth2Server](https://oauth2-server.readthedocs.io/en/latest/api/oauth2-server.html#new-oauth2server-options) instance.

Note that [OAuth2Server](https://oauth2-server.readthedocs.io/en/latest/api/oauth2-server.html) requires a [model](https://oauth2-server.readthedocs.io/en/latest/model/overview.html) object through which some aspects or storage, retrieval and custom validation are abstracted. Therefore, in most cases you will need to use [async configuration](#async-configuration) to import your repository module for the model implementation.

> The [model specification](https://oauth2-server.readthedocs.io/en/latest/model/spec.html) see documentation for details.

## Decorators

The module provides decorators to help you create `OAuth2Server` handlers (endpoints). 

|  Decorator                                                  | `OAuth2Server` handler        |
| ----------------------------------------------------------- | ----------------------------- |
| `@OAuth2ServerAuthenticate(options?: AuthenticateOptions)`  | `OAuth2Server#authenticate()` |
| `@OAuth2ServerAuthorize(options?: AuthorizeOptions)`        | `OAuth2Server#authorize()`    |
| `@OAuth2ServerToken(options?: TokenOptions)`                | `OAuth2Server#token()`        |

Any valid option for `@OAuth2ServerAuthenticate()`, `@OAuth2ServerAuthorize()` and `@OAuth2ServerToken()` can be passed to the `OAuth2ServerModule.forRoot()` method as well. The supplied options will be used as default for the other methods.

In addition, we provide the `@OAuth2ServerOAuth()` decorator lets you retrieve oauth information from the `res.locals.oauth` property.

The following is an example controller for oauth2 server endpoints:

```typescript
import { Controller, Get, Post } from '@nestjs/common';
import { OAuth2ServerAuthenticate, OAuth2ServerAuthorize, OAuth2ServerToken, OAuth2ServerOAuth, OAuth } from 'nest-oauth2-server';

@Controller('oauth')
export class OAuthController {
  @Get('user')
  @OAuth2ServerAuthenticate()
  user(@OAuth2ServerOAuth() oauth: OAuth) {
    return oauth.token.user;
  }

  @Post('authorize')
  @OAuth2ServerAuthorize()
  authorize() {}

  @Post('token')
  @OAuth2ServerToken()
  token() {}
}
```

## Async configuration

When you need to pass module options asynchronously instead of statically, use the `forRootAsync()` method. As with most dynamic modules, Nest provides several techniques to deal with async configuration.

One technique is to use a factory function:

```typescript
OAuth2ServerModule.forRootAsync({
  useFactory: () => ({
    model: model,
  }),
});
```

Like other factory providers, our factory function can be [async](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory) and can inject dependencies through `inject`.

```typescript
OAuth2ServerModule.forRootAsync({
  imports: [OAuthModule],
  useFactory: async (model: OAuth2ServerModel) => ({
    model: model
  }),
  inject: [OAuth2ServerModel],
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
  constructor(private readonly model: OAuth2ServerModel) {}

  createOAuth2ServerOptions(): OAuth2ServerModuleOptions {
    return {
      model: this.model,
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

## Example

A working example is available in [test](./test/app/) directory.

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/nest-oauth2-server.svg
[npm-url]: https://npmjs.com/package/nest-oauth2-server
[action-image]: https://img.shields.io/github/workflow/status/chunkai1312/nest-oauth2-server/Node.js%20CI
[action-url]: https://github.com/chunkai1312/nest-oauth2-server/actions/workflows/node.js.yml
