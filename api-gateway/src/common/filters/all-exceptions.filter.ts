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

    if (typeof exception === 'object' && exception !== null) {
      // Prioritize structured response object from HttpExceptions
      const innerResponse = exception.response;
      const statusCode = (innerResponse && (innerResponse.statusCode || innerResponse.status)) || exception.statusCode || exception.status;
      const innerMessage = (innerResponse && innerResponse.message) || exception.message;

      if (statusCode) {
        if (typeof statusCode === 'number') {
          status = statusCode;
        } else if (typeof statusCode === 'string' && !isNaN(parseInt(statusCode))) {
          status = parseInt(statusCode);
        }
      }

      if (innerMessage) {
        message = Array.isArray(innerMessage) ? innerMessage[0] : innerMessage;
      }
    }

    return response.status(status).json({
      statusCode: status,
      message: message,
      error: exception.error || 'Microservice Error',
    });
  }
}
