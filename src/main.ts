import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IAppConfig } from './common/interface/common.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const loggingInterceptor = app.get(LoggingInterceptor);
  app.useGlobalInterceptors(loggingInterceptor);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const appConfig = configService.get<IAppConfig>('app');
  await app.listen(appConfig.port);
  Logger.log(
    `
 ____       _      ____    _  __  ___   _   _    ____   _        ___    _____ 
|  _ \\     / \\    |  _ \\  | |/ / |_ _| | \\ | |  / ___| | |      / _ \\  |_   _|
| |_) |   / _ \\   | |_) | | ' /   | |  |  \\| | | |  _  | |     | | | |   | |  
|  __/   / ___ \\  |  _ <  | . \\   | |  | |\\  | | |_| | | |___  | |_| |   | |  
|_|     /_/   \\_\\ |_| \\_\\ |_|\\_\\ |___| |_| \\_|  \\____| |_____|  \\___/    |_|  
APPLICATION NAME: ${appConfig}
VERSION: ${appConfig.version}
PORT: ${appConfig.port}

`,
    NestApplication.name,
  );
}
bootstrap();
