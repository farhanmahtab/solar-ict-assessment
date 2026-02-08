import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(); // Enable for frontend
  await app.listen(process.env.PORT || 3000);
  console.log(`API Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
