import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ParkingLotModule } from './parking-lot/parking-lot.module';
import { ParkingSlotModule } from './parking-slot/parking-slot.module';
import { TicketModule } from './ticket/ticket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { CarModule } from './car/car.module';
import { AdminUserModule } from './admin-user/admin-user.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { IDatabaseConfig } from './common/interface/common.interface';
import { ClsModule } from 'nestjs-cls';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guard/jwt.guard';
import ticketConfig from './config/ticket.config';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, ticketConfig],
    }),
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf((info) => JSON.stringify({ ...info })),
      ),
      transports: [new winston.transports.Console()],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<IDatabaseConfig>) => {
        return configService.get('database');
      },
    }),
    ParkingLotModule,
    ParkingSlotModule,
    TicketModule,
    ActivityLogModule,
    CarModule,
    AdminUserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    LoggingInterceptor,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
