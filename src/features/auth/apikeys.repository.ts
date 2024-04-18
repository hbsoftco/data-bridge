import { Injectable } from '@nestjs/common';
import { ApiKeyEntity } from './apikey.entity';

@Injectable()
export class ApiKeysRepository {
  private keys: ApiKeyEntity[] = [
    {
      name: 'Panel Key',
      key: process.env.API_KEY,
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
