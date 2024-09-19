import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as config from './config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(config.envs.PORT);
  logger.log(
    `Payments Microservices is running on port ${config.envs.PORT}...`,
  );
}
bootstrap();
