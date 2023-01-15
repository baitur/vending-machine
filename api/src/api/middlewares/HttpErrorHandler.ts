import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Service } from 'typedi';

@Middleware({ type: 'after' })
@Service()
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err: any) => any) {
    if (error instanceof HttpError) {
      response.status(error.httpCode).json(error);
    }

    next(error);
  }
}
