import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from './auth.service';
import { ApiKeyEntity } from './apikey.entity';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private readonly authService: AuthService) {
    super(
      {
        header: 'Authorization',
        prefix: 'ApiKey ',
      },
      false,
    );
  }

  public validate(apiKey: string): ApiKeyEntity {
    const key = this.authService.findKey(apiKey);

    if (!key) {
      throw new UnauthorizedException();
    }

    return key;
  }
}
