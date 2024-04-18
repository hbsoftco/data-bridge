import { Injectable } from '@nestjs/common';
// import { DatabaseService } from 'src/core/database/database.service';
import { DatabaseService } from '../../core/database/database.service';
// import { convertBigIntToString } from 'src/core/utils/convertBigIntToString.util';
import { convertBigIntToString } from '../../core/utils/convertBigIntToString.util';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(page: number, pageSize: number) {
    const users = await this.databaseService.users.findMany({
      skip: (page - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    // Convert BigInt values to string for each user
    return users.map(convertBigIntToString);
  }

  async findOne(id: number) {
    const user = await this.databaseService.users.findUnique({
      where: {
        id,
      },
    });

    // Convert BigInt values to string
    return convertBigIntToString(user);
  }
}
