import { DynamicModule, Module } from '@nestjs/common';
import { OAuth2ServerCoreModule } from './oauth2-server-core.module';
import { OAuth2ServerModuleOptions, OAuth2ServerModuleAsyncOptions } from './interfaces';

@Module({})
export class OAuth2ServerModule {
  static forRoot(options: OAuth2ServerModuleOptions): DynamicModule {
    return {
      module: OAuth2ServerModule,
      imports: [OAuth2ServerCoreModule.forRoot(options)],
      exports: [OAuth2ServerModule],
    };
  }

  static forRootAsync(options: OAuth2ServerModuleAsyncOptions): DynamicModule {
    return {
      module: OAuth2ServerModule,
      imports: [OAuth2ServerCoreModule.forRootAsync(options)],
      exports: [OAuth2ServerModule],
    };
  }
}
