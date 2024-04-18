import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ApiKeysRepository } from './apikeys.repository';
import { ApiKeyGuard } from '@src/core/guards/apikey.guard';
import { ApiKeyStrategy } from './apikey.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ApiKeysRepository, ApiKeyGuard, ApiKeyStrategy],
})
export class AuthModule {}
