import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('LoggingInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Lấy thông tin từ context của Message Pattern (Microservices)
    const data = context.switchToRpc().getData(); // Lấy dữ liệu message nhận vào

    const handler = context.getHandler().name; // Lấy tên của handler
    this.logger.log(`Received a messsage to "${handler}" handler`);

    const now = Date.now();

    // Lấy thông tin từ HTTP request
    const request = context.switchToHttp().getRequest();

    // Lấy body, query và params từ request
    const body = request.body; // DTO gửi qua @Body()
    const query = request.query; // Dữ liệu gửi qua @Query()
    const params = request.params; // Dữ liệu gửi qua @Param()

    if (body instanceof Object && Object.keys(body).length)
      this.logger.log(`Body data: ${JSON.stringify(body)}`);

    if (query instanceof Object && Object.keys(query).length)
      this.logger.log(`Query params: ${JSON.stringify(query)}`);
    if (params instanceof Object && Object.keys(params).length)
      this.logger.log(`Route params: ${JSON.stringify(params)}`);

    // Xử lý request và log kết quả phản hồi
    return next.handle().pipe(
      tap((response) => {
        const processingTime = Date.now() - now;
        this.logger.log(
          `Processing time of ${handler} handler: ${processingTime}ms`,
        );
      }),
    );
  }
}
