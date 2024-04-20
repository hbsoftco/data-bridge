import { Injectable } from '@nestjs/common';
import { ApiKeysRepository } from './apikeys.repository';
import { ApiKeyEntity } from './apikey.entity';

@Injectable()
export class AuthService {
  constructor(private apiKeysRepository: ApiKeysRepository) {}

  public findKey(key: string): ApiKeyEntity | undefined {
    return this.apiKeysRepository.findOne(key);
  }
}
