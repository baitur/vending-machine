import { Service } from 'typedi';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { UserRole } from '@api/models/User';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { authConfig } from '@base/config/app';
import { LoggedUserInterface } from '@api/Interfaces/LoggedUserInterface';

/**
 * The service that checks if user is logged.
 */
@Service()
export class AllowAnonUsersControlLevel implements ExpressMiddlewareInterface {
  role: UserRole = null;

  use(request: any, response: Response, next?: (err?: any) => any): any {
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, authConfig.providers.jwt.secret, (err: any, user: LoggedUserInterface) => {
        request.loggedUser = user;
        next();
      });
    } else {
      next();
    }
  }
}
