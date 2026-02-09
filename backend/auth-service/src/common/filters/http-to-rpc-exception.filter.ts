import { Catch, RpcExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(HttpException)
export class HttpToRpcExceptionFilter implements RpcExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): Observable<any> {
    const errorResponse = exception.getResponse();
    
    // NestJS HttpExceptions usually return:
    // { statusCode: 400, message: "...", error: "Bad Request" }
    // We wrap this so the API Gateway's filter can easily find it.
    return throwError(() => ({
      status: 'error',
      statusCode: exception.getStatus(),
      message: typeof errorResponse === 'object' ? (errorResponse as any).message : errorResponse,
      response: errorResponse, // Keep the original structure just in case
    }));
  }
}
