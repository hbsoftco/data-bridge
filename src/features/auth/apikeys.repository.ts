import { Injectable } from '@nestjs/common';
import { ApiKeyEntity } from './apikey.entity';

@Injectable()
export class ApiKeysRepository {
  private keys: ApiKeyEntity[] = [
    {
      name: 'Microservice Key',
      key: '37a5sde8-ee25-t58a-gf2f-75812989890a',
    },
  ];

  public findOne(key: string): ApiKeyEntity | undefined {
    const foundKey = this.keys.find((apiKey) => key === apiKey.key);
    if (foundKey) {
      return foundKey;
    }
    return undefined;
  }
}
