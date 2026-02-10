import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
dotenv.config();

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(process.cwd(), '../proto/user.proto'),
      url: `0.0.0.0:${process.env.USER_SERVICE_PORT || 3002}`,
    },
  });
  await app.listen();
  console.log('User Service (gRPC) is listening on port 3002...');
}
bootstrap();
