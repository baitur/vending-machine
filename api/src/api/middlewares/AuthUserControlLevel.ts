import { Service } from 'typedi';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { User, UserRole } from '@api/models/User';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { authConfig } from '@base/config/app';
import { LoggedUserInterface } from '@api/Interfaces/LoggedUserInterface';

/**
 * The service that checks if user is logged.
 */
@Service()
export class AuthUserControlLevel implements ExpressMiddlewareInterface {
  role: UserRole = null;

  use(request: any, response: Response, next?: (err?: any) => any): any {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).send({ status: 403, message: 'Unauthorized!' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, authConfig.providers.jwt.secret, (err: any, user: LoggedUserInterface) => {
      if (err || (!user || !user.role || (this.role && user.role && user.role != this.role))) {
        return response.status(403).send({ status: 403, message: 'Forbidden!' });
      }

      request.loggedUser = user;
      next();
    });
  }
}
