import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(page: number, pageSize: number) {
    const users = await this.databaseService.users.findMany({
      skip: (page - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    // Convert BigInt values to string for each user
    for (const user of users) {
      for (const key in user) {
        if (typeof user[key] === 'bigint') {
          user[key] = user[key].toString();
        }
      }
    }

    return users;
  }

  async findOne(id: number) {
    const user = await this.databaseService.users.findUnique({
      where: {
        id,
      },
    });

    // Convert BigInt values to string
    if (user) {
      for (const key in user) {
        if (typeof user[key] === 'bigint') {
          user[key] = user[key].toString();
        }
      }
    }

    return user;
  }
}
