import * as OAuth2Server from 'oauth2-server';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { defer, firstValueFrom, mergeMap, of, throwError } from 'rxjs';
import { OAuth2ServerModuleOptions, OAuth2ServerModuleAsyncOptions, OAuth2ServerOptionsFactory } from './interfaces';
import { MissingModelError } from './errors';
import { OAUTH2_SERVER, OAUTH2_SERVER_OPTIONS, OAUTH2_SERVER_MODEL, OAUTH2_SERVER_MODEL_METADATA } from './oauth2-server.constants';

@Module({})
export class OAuth2ServerCoreModule {
  static forRoot(options: OAuth2ServerModuleOptions): DynamicModule {
    return {
      global: true,
      module: OAuth2ServerCoreModule,
      imports: [this.registerModel()],
      providers: [
        {
          provide: OAUTH2_SERVER_OPTIONS,
          useValue: options,
        },
        {
          provide: OAUTH2_SERVER,
          useFactory: (options: OAuth2ServerModuleOptions, model: OAuth2Server.ServerOptions['model']): OAuth2Server => {
            return new OAuth2Server({ ...options, model });
          },
          inject: [
            OAUTH2_SERVER_OPTIONS,
            OAUTH2_SERVER_MODEL,
          ],
        },
      ],
      exports: [OAUTH2_SERVER],
    };
  }

  static forRootAsync(options: OAuth2ServerModuleAsyncOptions): DynamicModule {
    return {
      global: true,
      module: OAuth2ServerCoreModule,
      imports: (options.imports || []).concat(this.registerModel()),
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: OAUTH2_SERVER,
          useFactory: (options: OAuth2ServerModuleOptions, model: OAuth2Server.ServerOptions['model']): OAuth2Server => {
            return new OAuth2Server({ ...options, model });
          },
          inject: [
            OAUTH2_SERVER_OPTIONS,
            OAUTH2_SERVER_MODEL,
          ],
        },
      ],
      exports: [OAUTH2_SERVER],
    };
  }

  private static createAsyncProviders(options: OAuth2ServerModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: OAuth2ServerModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: OAUTH2_SERVER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: OAUTH2_SERVER_OPTIONS,
      useFactory: async (optionsFactory: OAuth2ServerOptionsFactory) =>
        await optionsFactory.createOAuth2ServerOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }

  private static registerModel() {
    return {
      global: true,
      module: OAuth2ServerCoreModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: OAUTH2_SERVER_MODEL,
          useFactory: (discoverService: DiscoveryService, reflector: Reflector): Promise<OAuth2Server.BaseModel> => {
            const getProvider = async () => {
              const service = discoverService
                .getProviders()
                .find(
                  (provider: InstanceWrapper) =>
                    provider.metatype &&
                    reflector.get(
                      OAUTH2_SERVER_MODEL_METADATA,
                      provider.metatype,
                    ),
                );
              return service?.instance;
            };
            return firstValueFrom(
              defer(() => getProvider()).pipe(
                mergeMap(instance =>
                  instance ? of(instance) : throwError(() => new MissingModelError()),
                ),
              ),
            );
          },
          inject: [DiscoveryService, Reflector],
        },
      ],
      exports: [OAUTH2_SERVER_MODEL],
    };
  }
}
