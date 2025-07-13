import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAppCls } from '../common/interface/common.interface';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const userIp = request.ip || request.connection?.remoteAddress || 'unknown';
    const user = request.user;
    this.cls.set<IAppCls>('ipAddress', userIp);
    this.cls.set<IAppCls>('user', user);
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const responseTime = Date.now() - requestTime;
        this.logger.log({
          data: data,
          statusCode: response.statusCode,
          responseTime: `${responseTime}ms`,
        });
        return data;
      }),
    );
  }
}
