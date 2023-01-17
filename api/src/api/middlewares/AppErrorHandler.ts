import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import { Service } from 'typedi';
import { QueryFailedError } from 'typeorm';

@Middleware({ type: 'after' })
@Service()
export class AppErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err: any) => any) {
    if (error instanceof HttpError) {
      response.status(error.httpCode).json(error);
    }

    if (error instanceof QueryFailedError) {
      // @ts-ignore
      response.status(500).json({ message: error.sqlMessage });
    }

    next(error);
  }
}
