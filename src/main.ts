import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { setupSwagger } from './libs/swagger';
import * as basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // App versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const swaggerUser = configService.get<string>('SWAGGER_USER');
  const swaggerPassword = configService.get<string>('SWAGGER_PASSWORD');

  if (swaggerUser && swaggerPassword) {
    const users: { [username: string]: string } = {};
    users[swaggerUser] = swaggerPassword;

    app.use(
      ['/swagger'],
      basicAuth({
        challenge: true,
        users,
      }),
    );
  }

  // Swagger
  setupSwagger(app);

  await app.listen(3000);
}

bootstrap();
