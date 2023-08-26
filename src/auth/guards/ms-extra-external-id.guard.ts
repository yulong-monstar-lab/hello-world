import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as aad from 'azure-ad-jwt-v2';
import { Request } from 'express';

@Injectable()
export class MsExtraExternalIdGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const accessToken = authorizationHeader.split(' ')[1];
    console.log('***************accessToken');
    console.log(accessToken);

    return new Promise((resolve, reject) => {
      aad.verify(
        accessToken,
        (options) => {
          // TODO: Replace hard-coded values with values from ${process.env.variableName}
          options.Authority =
            'https://sts.windows.net/dbe439f7-87af-42fa-9326-c61c1ecd465f/discovery/keys';
          options.Audience = '00000003-0000-0000-c000-000000000000';
          options.issuer =
            'https://sts.windows.net/dbe439f7-87af-42fa-9326-c61c1ecd465f/';
        },
        function (err, decodedToken) {
          if (decodedToken) {
            console.log('JWT is valid');
            // keep decodedToken in request.user for later use
            request.user = decodedToken;
            console.log('***************decodedToken');
            console.log(decodedToken);
            resolve(true);
          } else {
            console.log('JWT is invalid: ' + err);
            reject(new UnauthorizedException('Invalid access token'));
          }
        },
      );
    });
  }
}
