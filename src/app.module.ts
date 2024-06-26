import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './features/user/user.module';
import { AuthModule } from './features/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { AppModule as AppsModule } from './features/app/app.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().default(3000).required(),
        DATABASE_URL: Joi.string().required(),
        API_KEY: Joi.string().required(),
      }),
    }),
    UserModule,
    AuthModule,
    DatabaseModule,
    AppsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
