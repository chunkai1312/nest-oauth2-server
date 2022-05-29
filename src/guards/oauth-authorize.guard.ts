import * as OAuth2Server from 'oauth2-server';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { OAuthGuard } from './oauth.guard';

@Injectable()
export class OAuthAuthorizeGuard extends OAuthGuard {
  protected async execute(context: ExecutionContext, request: OAuth2Server.Request, response: OAuth2Server.Response, options?: OAuth2Server.AuthorizeOptions): Promise<boolean> {
    try {
      const code = await this.oauthServer.authorize(request, response, options);
      const res = context.switchToHttp().getResponse();
      res.locals.oauth = { code };
      this.handleResponse(context, response);
      return true;
    } catch (error) {
      this.handleError(context, error, response);
    }
  }
}
