import { authConfig } from '@base/config/app';
import * as jwt from 'jsonwebtoken';
import { LoggedUserInterface } from '@api/Interfaces/LoggedUserInterface';

export class JWTProvider {
  public sign(payload: LoggedUserInterface, dataReturn: object): object {
    const jwtConfig = authConfig.providers.jwt;

    return {
      ...dataReturn,
      access_token: jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      }),
      expires_in: jwtConfig.expiresIn,
    };
  }
}
