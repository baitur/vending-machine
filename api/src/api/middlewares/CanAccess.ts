import { Response } from 'express';
import { UserRole } from '@api/models/User';

export function CanAccess(role: UserRole): any {
  return function(request: any, response: Response, next?: (err?: any) => any) {
    const loggedUser = request.loggedUser;
    let haveAccess = true;

    if (!loggedUser) {
      return response.status(403).send({ status: 401, message: 'Unauthorized!' });
    }

    if (loggedUser.role != role) {
      haveAccess = false;
    }

    if (!haveAccess) {
      return response.status(403).send({
        status: 403,
        message: 'User does not have the right permissions!',
      });
    }

    return next();
  };
}
