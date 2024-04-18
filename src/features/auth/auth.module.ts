import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ApiKeysRepository } from './apikeys.repository';
import { ApiKeyGuard } from '@src/core/guards/apikey.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ApiKeysRepository, ApiKeyGuard],
})
export class AuthModule {}
