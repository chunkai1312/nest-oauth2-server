import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { BaseModel, ServerOptions } from 'oauth2-server';

export interface OAuth2ServerModuleOptions extends Omit<ServerOptions, 'model'> {}

export interface OAuth2ServerOptionsFactory {
  createOAuth2ServerOptions(): Promise<OAuth2ServerModuleOptions> | OAuth2ServerModuleOptions;
}

export interface OAuth2ServerModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<OAuth2ServerOptionsFactory>;
  useClass?: Type<OAuth2ServerOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<OAuth2ServerModuleOptions> | OAuth2ServerModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
