import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'notification',
      protoPath: join(process.cwd(), '../proto/notification.proto'),
      url: `0.0.0.0:${process.env.NOTIFICATION_SERVICE_PORT || 3003}`,
    },
  });
  await app.listen();
  console.log('Notification Service (gRPC) is listening on port 3003...');
}
bootstrap();
