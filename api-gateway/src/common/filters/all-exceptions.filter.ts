import { Catch, RpcExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception.status && exception.message) {
      status = exception.status;
      message = exception.message;
    } else if (exception.response && typeof exception.response === 'object') {
       status = exception.status || exception.response.statusCode || 500;
       message = exception.response.message || exception.message;
    } else if (typeof exception === 'object') {
      status = exception.statusCode || exception.status || 500;
      message = exception.message || 'Error occurred in microservice';
    }

    return response.status(status).json({
      statusCode: status,
      message: message,
      error: exception.error || 'Microservice Error',
    });
  }
}
