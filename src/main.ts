import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as config from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');

  // REST Communication
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

  // Microservice
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: config.envs.NATS_SERVERS,
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();

  await app.listen(config.envs.PORT);
  logger.log(
    `Payments Microservices is running on port ${config.envs.PORT}...`,
  );
}
bootstrap();
