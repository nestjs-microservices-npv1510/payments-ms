import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { isInstance } from 'class-validator';
import { error } from 'console';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class RpcCatchErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RpcCatchErrorInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        // console.log('ERROR FROM PAYMENT INTERCEPTOR');
        // console.log(err);
        this.logger.error(`Error: ${JSON.stringify(err || {}, null, 2)}`);
        this.logger.error(`Error message: ${err?.message || 'No message'}`);

        // Nếu err đã là RpcException => chỉ gửi
        if (err instanceof RpcException) {
          throw err;
        }

        // Nếu err không phải RpcExeption chuyển thành RpcException và gửi
        throw new RpcException({
          status: 'error',
          message: err?.message || 'An unknown error occurred',
        });
      }),
    );
  }
}
