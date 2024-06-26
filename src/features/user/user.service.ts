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
    justHaveEmail: boolean | string,
    justHavePhone: boolean | string,
    notVerify: boolean | string,
    sex: number,
    status: number,
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

    // notVerify
    if (notVerify == 'true' && notVerify) {
      whereClause.verified = notVerify == 'true' ? 0 : 1;
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

    // If justHaveEmail is true, add condition for email
    if (justHaveEmail == 'true' && justHaveEmail) {
      whereClause.email = {
        not: null,
      };
      whereClause.phone = {
        equals: null,
      };
    }

    // If justHavePhone is true, add condition for phone
    if (justHavePhone == 'true' && justHavePhone) {
      whereClause.phone = {
        not: null,
      };
      whereClause.email = {
        equals: null,
      };
    }

    // If sex is provided, add condition for gender
    if (sex == 0 || sex == 1) {
      whereClause.gender = sex == 0 ? 'female' : 'male';
    }

    if (status == 0 || status == 1) {
      whereClause.blocked = Number(status);
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

  async exportUsers(
    type: 'email' | 'phone',
    filter: string,
    sex: number,
    fromDate: string,
    toDate: string,
    haveEmail: boolean | string,
    havePhone: boolean | string,
    notVerify: boolean | string,
    status: number,
  ) {
    const whereClause: any = {
      [type]: {
        not: null,
      },
    };

    // If filter is provided, add condition for first_name
    if (filter && filter !== null && filter !== 'null') {
      whereClause.first_name = {
        contains: filter,
      };
    }

    // notVerify
    if (notVerify == 'true' && notVerify) {
      whereClause.verified = notVerify == 'true' ? 0 : 1;
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

    if (status == 0 || status == 1) {
      whereClause.blocked = Number(status);
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
    justHaveEmail: boolean | string,
    justHavePhone: boolean | string,
    notVerify: boolean | string,
    status: number,
  ) {
    try {
      const whereClause: any = {};

      // If filter is provided, add condition for first_name
      if (filter && filter !== null && filter !== 'null') {
        whereClause.first_name = {
          contains: filter,
        };
      }

      // notVerify
      if (notVerify == 'true' && notVerify) {
        whereClause.verified = notVerify == 'true' ? 0 : 1;
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

      // If justHaveEmail is true, add condition for email
      if (justHaveEmail == 'true' && justHaveEmail) {
        whereClause.email = {
          not: null,
        };
        whereClause.phone = {
          equals: null,
        };
      }

      // If justHavePhone is true, add condition for phone
      if (justHavePhone == 'true' && justHavePhone) {
        whereClause.phone = {
          not: null,
        };
        whereClause.email = {
          equals: null,
        };
      }

      // If sex is provided, add condition for gender
      if (sex == 0 || sex == 1) {
        whereClause.gender = sex == 0 ? 'female' : 'male';
      }

      if (status == 0 || status == 1) {
        whereClause.blocked = Number(status);
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

  async getNewUsersLastMonth(): Promise<number> {
    // Get the first day of last month at 00:00:00
    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);

    // Get the last day of last month at 23:59:59
    const endOfLastMonth = new Date();
    endOfLastMonth.setMonth(endOfLastMonth.getMonth(), 0);
    endOfLastMonth.setHours(23, 59, 59, 999);

    return await this.databaseService.users.count({
      where: {
        created_at: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
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

  async getAnnualUsers(
    firstOfYearUTC: string,
    endOfYearUTC: string,
    // endOfFirstMonthDayUTC: string,
  ): Promise<{ [month: string]: number }> {
    // Convert the input strings to Date objects
    const startOfYear = new Date(firstOfYearUTC);
    const endOfYear = new Date(endOfYearUTC);
    // const endOfFirstMonthDay = new Date(endOfFirstMonthDayUTC);

    // Query the database for all new users in the year
    const newUsers = await this.databaseService.users.findMany({
      where: {
        created_at: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: {
        created_at: true,
      },
    });

    // Initialize an object to hold the user counts for each month
    const monthlyUserCounts: { [month: string]: number } = {};

    // Iterate through each month of the year
    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(
        Date.UTC(startOfYear.getUTCFullYear(), month, 1),
      );
      const endOfMonth = new Date(
        Date.UTC(startOfYear.getUTCFullYear(), month + 1, 0),
      );

      // Count users for the current month
      const count = newUsers.filter((user) => {
        if (!user.created_at) return false;
        const createdAt = new Date(user.created_at);
        return createdAt >= startOfMonth && createdAt <= endOfMonth;
      }).length;

      // Format the month as YYYY-MM
      const formattedMonth = `${startOfYear.getUTCFullYear()}-${String(month + 1).padStart(2, '0')}`;

      // Store the count in the object
      monthlyUserCounts[formattedMonth] = count;
    }

    return monthlyUserCounts;
  }

  // async getAnnualUsers(
  //   firstOfYearUTC: string,
  //   endOfYearUTC: string,
  //   endOfFirstMonthDayUTC: string,
  // ): Promise<{ [month: string]: number }> {
  //   // Convert the input strings to Date objects
  //   const startOfYear = new Date(firstOfYearUTC);
  //   const endOfYear = new Date(endOfYearUTC);
  //   const endOfFirstMonthDay = new Date(endOfFirstMonthDayUTC);

  //   // Query the database for all new users in the year
  //   const newUsers = await this.databaseService.users.findMany({
  //     where: {
  //       created_at: {
  //         gte: startOfYear,
  //         lte: endOfYear,
  //       },
  //     },
  //     select: {
  //       created_at: true,
  //     },
  //   });

  //   // Initialize the result object with all months of the year and a count of 0
  //   const result: { [month: string]: number } = {};
  //   for (let month = 0; month < 12; month++) {
  //     const monthKey = `${startOfYear.getFullYear()}-${String(month + 1).padStart(2, '0')}`;
  //     result[monthKey] = 0;
  //   }

  //   // Update the result object with the actual counts
  //   for (const user of newUsers) {
  //     const month = user.created_at?.getUTCMonth();
  //     const year = user.created_at?.getUTCFullYear();
  //     if (month) {
  //       const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  //       result[monthKey]++;
  //     }
  //   }

  //   return result;
  // }

  async getMonthlyUsers(
    firstOfMonthUTC: string,
    endOfMonthUTC: string,
    endOfStartDayOfMonthUTC: string,
  ) {
    // Convert the input strings to Date objects
    const startOfMonth = new Date(firstOfMonthUTC);
    const endOfMonth = new Date(endOfMonthUTC);
    const endOfStartDayOfMonth = new Date(endOfStartDayOfMonthUTC);

    console.log(startOfMonth);
    console.log(endOfStartDayOfMonth);

    // Query the database for all new users in the month
    const newUsers = await this.databaseService.users.findMany({
      where: {
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        created_at: true,
      },
    });

    // Initialize an array to hold the user counts for each day
    const userCounts = [];

    // Iterate through each day of the month
    let currentStart = new Date(startOfMonth);
    let currentEnd = new Date(endOfStartDayOfMonth);
    let dayIndex = 1;

    while (currentStart <= endOfMonth) {
      // Count users for the current day
      const count = newUsers.filter((user) => {
        if (!user.created_at) return false;
        const createdAt = new Date(user.created_at);
        return createdAt >= currentStart && createdAt <= currentEnd;
      }).length;

      // Push the count for the current day to the array
      userCounts.push({ [`day_${dayIndex}`]: count });

      // Move to the next day
      dayIndex++;
      currentStart = new Date(currentStart.setDate(currentStart.getDate() + 1));
      currentEnd = new Date(currentEnd.setDate(currentEnd.getDate() + 1));
    }

    return userCounts;
  }

  async getNewUsersYesterday(): Promise<number> {
    // Get yesterday's date at 00:00:00
    const startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);

    // Get yesterday's date at 23:59:59
    const endOfYesterday = new Date();
    endOfYesterday.setDate(endOfYesterday.getDate() - 1);
    endOfYesterday.setHours(23, 59, 59, 999);

    return await this.databaseService.users.count({
      where: {
        created_at: {
          gte: startOfYesterday,
          lte: endOfYesterday,
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
