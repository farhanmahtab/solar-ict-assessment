import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(process.cwd(), '../proto/auth.proto'),
          url: `${process.env.AUTH_SERVICE_HOST || '127.0.0.1'}:${process.env.AUTH_SERVICE_PORT || 3006}`,
        },
      },
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(process.cwd(), '../proto/user.proto'),
          url: `${process.env.USER_SERVICE_HOST || '127.0.0.1'}:${process.env.USER_SERVICE_PORT || 3002}`,
        },
      },
    ]),
  ],
  controllers: [AuthController, UsersController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
