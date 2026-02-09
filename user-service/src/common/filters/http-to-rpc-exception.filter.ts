import { Catch, RpcExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(HttpException)
export class HttpToRpcExceptionFilter implements RpcExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): Observable<any> {
    const errorResponse = exception.getResponse();
    
    return throwError(() => ({
      status: 'error',
      statusCode: exception.getStatus(),
      message: typeof errorResponse === 'object' ? (errorResponse as any).message : errorResponse,
      response: errorResponse,
    }));
  }
}
