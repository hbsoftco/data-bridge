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
  app.use(
    ['/swagger'],
    basicAuth({
      challenge: true,
      users: {
        [configService.get('SWAGGER_USER')]:
          configService.get('SWAGGER_PASSWORD'),
      },
    }),
  );

  // Swagger
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
