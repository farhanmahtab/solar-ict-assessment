import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
dotenv.config();

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(process.cwd(), '../proto/auth.proto'),
      url: `0.0.0.0:${process.env.AUTH_SERVICE_PORT || 3006}`,
    },
  });
  await app.listen();
  console.log('Auth Service (gRPC) is listening on port 3006...');
}
bootstrap();
