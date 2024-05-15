import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';
import { convertBigIntToString } from '../../core/utils/convertBigIntToString.util';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(
    page: number,
    pageSize: number,
    filter: string,
    haveEmail: boolean | string,
    havePhone: boolean | string,
    sex: number,
    fromDate: string,
    toDate: string,
  ) {
    const whereClause: any = {};

    // If filter is provided, add condition for first_name
    if (filter && filter !== null && filter !== 'null') {
      whereClause.OR = [
        { first_name: { contains: filter } },
        { email: { contains: filter } },
        { phone: { contains: filter } },
      ];
    }

    // If haveEmail is true, add condition for email
    if (haveEmail == 'true' && haveEmail) {
      whereClause.email = {
        not: null,
      };
    }

    // If havePhone is true, add condition for phone
    if (havePhone == 'true' && havePhone) {
      whereClause.phone = {
        not: null,
      };
    }

    // If sex is provided, add condition for gender
    if (sex == 0 || sex == 1) {
      whereClause.gender = sex == 0 ? 'female' : 'male';
    }

    if (
      fromDate &&
      fromDate !== null &&
      fromDate !== 'null' &&
      toDate &&
      toDate !== null &&
      toDate !== 'null'
    ) {
      whereClause.created_at = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    }

    const users = await this.databaseService.users.findMany({
      where: whereClause,
      skip: (page - 1) * Number(pageSize),
      take: Number(pageSize),
    });

    // Convert BigInt values to string for each user
    return users.map(convertBigIntToString);
  }

  async exportUsers(type: 'email' | 'phone') {
    const users = await this.databaseService.users.findMany({
      where: {
        [type]: {
          not: null,
        },
      },
      select: {
        [type]: true,
      },
    });

    // Convert BigInt values to string
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

  async count(
    filter: string,
    sex: number,
    fromDate: string,
    toDate: string,
    haveEmail: boolean | string,
    havePhone: boolean | string,
  ) {
    try {
      const whereClause: any = {};

      // If filter is provided, add condition for first_name
      if (filter && filter !== null && filter !== 'null') {
        whereClause.first_name = {
          contains: filter,
        };
      }

      // If haveEmail is true, add condition for email
      if (haveEmail == 'true' && haveEmail) {
        whereClause.email = {
          not: null,
        };
      }

      // If havePhone is true, add condition for email
      if (havePhone == 'true' && havePhone) {
        whereClause.phone = {
          not: null,
        };
      }

      // If sex is provided, add condition for gender
      if (sex == 0 || sex == 1) {
        whereClause.gender = sex == 0 ? 'female' : 'male';
      }

      if (
        fromDate &&
        fromDate !== null &&
        fromDate !== 'null' &&
        toDate &&
        toDate !== null &&
        toDate !== 'null'
      ) {
        whereClause.created_at = {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        };
      }
      return await this.databaseService.users.count({
        where: whereClause,
      });
    } catch (error) {}
  }

  async getUserDataList(
    id: number,
    page: number,
    pageSize: number,
    sessionType: string,
    type: string,
    fromDate: string,
    toDate: string,
  ) {
    const skip = (page - 1) * pageSize;

    const whereClause: any = {
      user_id: {
        equals: id,
      },
    };

    if (sessionType && sessionType !== null && sessionType !== 'null') {
      whereClause.sessionType = sessionType;
    }

    if (type && type !== null && type !== 'null') {
      whereClause.type = type;
    }

    if (
      fromDate &&
      fromDate !== null &&
      fromDate !== 'null' &&
      toDate &&
      toDate !== null &&
      toDate !== 'null'
    ) {
      whereClause.created_at = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    }

    const userDataList = await this.databaseService.data.findMany({
      where: whereClause,
      orderBy: { started_at: 'desc' }, // You can change the ordering if needed
      skip,
      take: +pageSize,
      include: { locations: true }, // Include related locations if needed
    });

    return userDataList.map(convertBigIntToString);
  }

  async userDataCount(
    id: number,
    sessionType: string,
    type: string,
    fromDate: string,
    toDate: string,
  ) {
    try {
      const whereClause: any = { user_id: id };

      if (sessionType && sessionType !== null && sessionType !== 'null') {
        whereClause.sessionType = sessionType;
      }

      if (type && type !== null && type !== 'null') {
        whereClause.type = type;
      }

      if (
        fromDate &&
        fromDate !== null &&
        fromDate !== 'null' &&
        toDate &&
        toDate !== null &&
        toDate !== 'null'
      ) {
        whereClause.created_at = {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        };
      }
      return await this.databaseService.data.count({
        where: whereClause,
      });
    } catch (error) {}
  }

  async blockUser(id: number, block: boolean) {
    const user = await this.databaseService.users.update({
      where: { id },
      data: { blocked: block ? 1 : 0 },
    });

    // Convert BigInt values to string
    return convertBigIntToString(user);
  }

  async getUsersCount(): Promise<number> {
    return await this.databaseService.users.count();
  }

  async getMaleUsersCount(): Promise<number> {
    return await this.databaseService.users.count({
      where: { gender: 'male' },
    });
  }

  async getFemaleUsersCount(): Promise<number> {
    return await this.databaseService.users.count({
      where: { gender: 'female' },
    });
  }

  async getUnknownSexUsersCount(): Promise<number> {
    return await this.databaseService.users.count({
      where: { gender: null },
    });
  }

  async getUsersWithEmailAndNullPhone(): Promise<number> {
    return await this.databaseService.users.count({
      where: {
        email: { not: null },
        phone: null,
      },
    });
  }

  async getUsersWithPhoneAndNullEmail(): Promise<number> {
    return await this.databaseService.users.count({
      where: {
        phone: { not: null },
        email: null,
      },
    });
  }

  async getUsersWithPhoneAndEmail(): Promise<number> {
    return await this.databaseService.users.count({
      where: {
        phone: { not: null },
        email: { not: null },
      },
    });
  }

  async getUsersWithDefaultProfile(): Promise<number> {
    return await this.databaseService.users.count({
      where: {
        profile_picture: { contains: 'default_users_profile' },
      },
    });
  }

  async getUsersWithoutDefaultProfile(): Promise<number> {
    return await this.databaseService.users.count({
      where: {
        NOT: {
          profile_picture: {
            contains: 'default_users_profile',
          },
        },
        AND: {
          profile_picture: {
            not: null,
          },
        },
      },
    });
  }

  async getUsersWithNullProfile(): Promise<number> {
    return await this.databaseService.users.count({
      where: {
        profile_picture: null,
      },
    });
  }

  async getNewUsersInMonth(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return await this.databaseService.users.count({
      where: {
        created_at: {
          gte: thirtyDaysAgo,
        },
      },
    });
  }

  async getActiveUsers(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return await this.databaseService.users.count({
      where: {
        last_connection_date: {
          gte: thirtyDaysAgo,
        },
      },
    });
  }
  async getActiveUsersToday(): Promise<number> {
    // Get today's date at 00:00:00
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Get today's date at 23:59:59
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return await this.databaseService.users.count({
      where: {
        last_connection_date: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });
  }

  async getNewUsersToday(): Promise<number> {
    // Get today's date at 00:00:00
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Get today's date at 23:59:59
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return await this.databaseService.users.count({
      where: {
        created_at: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });
  }
}
