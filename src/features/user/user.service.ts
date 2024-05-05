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
    userId: number,
    page: number,
    pageSize: number,
    sessionType: string,
    type: string,
    fromDate: string,
    toDate: string,
  ) {
    const skip = (page - 1) * pageSize;

    const whereClause: any = { user_id: userId };

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
    userId: number,
    sessionType: string,
    type: string,
    fromDate: string,
    toDate: string,
  ) {
    try {
      const whereClause: any = { user_id: userId };

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
}
