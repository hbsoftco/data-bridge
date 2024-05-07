import {
  Controller,
  Param,
  Get,
  Query,
  UseGuards,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '@src/core/guards/apikey.guard';

@ApiTags('User')
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(ApiKeyGuard)
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('filter') filter: string,
    @Query('sex') sex: number,
    @Query('haveEmail') haveEmail: boolean,
    @Query('havePhone') havePhone: boolean,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const data = await this.userService.findAll(
      page,
      pageSize,
      filter,
      havePhone,
      haveEmail,
      sex,
      fromDate,
      toDate,
    );
    const count = await this.userService.count(
      filter,
      sex,
      fromDate,
      toDate,
      haveEmail,
      havePhone,
    );

    return { data, count };
  }

  @UseGuards(ApiKeyGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findOne(+id);

    return { data };
  }

  @UseGuards(ApiKeyGuard)
  @Get(':id/data')
  async getUserDataList(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('sessionType') sessionType: string,
    @Query('type') type: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const data = await this.userService.getUserDataList(
      +id,
      page,
      pageSize,
      sessionType,
      type,
      fromDate,
      toDate,
    );

    const count = await this.userService.userDataCount(
      +id,
      sessionType,
      type,
      fromDate,
      toDate,
    );

    return { data, count };
  }

  @UseGuards(ApiKeyGuard)
  @Post(':id/block')
  async blockUser(@Param('id') id: string, @Body('block') block: boolean) {
    const data = await this.userService.blockUser(+id, block);

    return { data };
  }

  @UseGuards(ApiKeyGuard)
  @Get('/export/users')
  async exportUsers(@Query('type') type: 'email' | 'phone') {
    if (!type) {
      throw new BadRequestException('Parameter "type" is required.');
    }

    const data = await this.userService.exportUsers(type);

    return { data };
  }

  @UseGuards(ApiKeyGuard)
  @Get('/statistics/users')
  async statistics() {
    const getActiveUsers = await this.userService.getActiveUsers();
    const getUsersCount = await this.userService.getUsersCount();
    const getMaleUsersCount = await this.userService.getMaleUsersCount();
    const getFemaleUsersCount = await this.userService.getFemaleUsersCount();
    const getUnknownSexUsersCount =
      await this.userService.getUnknownSexUsersCount();
    const getUsersWithEmailAndNullPhone =
      await this.userService.getUsersWithEmailAndNullPhone();
    const getUsersWithPhoneAndNullEmail =
      await this.userService.getUsersWithPhoneAndNullEmail();
    const getUsersWithPhoneAndEmail =
      await this.userService.getUsersWithPhoneAndEmail();
    const getUsersWithDefaultProfile =
      await this.userService.getUsersWithDefaultProfile();
    const getUsersWithoutDefaultProfile =
      await this.userService.getUsersWithoutDefaultProfile();
    const getUsersWithNullProfile =
      await this.userService.getUsersWithNullProfile();
    const getNewUsersToday = await this.userService.getNewUsersToday();
    const getNewUsersInMonth = await this.userService.getNewUsersInMonth();

    return {
      getActiveUsers,
      getNewUsersInMonth,
      getNewUsersToday,
      getUsersCount,
      getMaleUsersCount,
      getFemaleUsersCount,
      getUnknownSexUsersCount,
      getUsersWithEmailAndNullPhone,
      getUsersWithPhoneAndNullEmail,
      getUsersWithPhoneAndEmail,
      getUsersWithDefaultProfile,
      getUsersWithoutDefaultProfile,
      getUsersWithNullProfile,
    };
  }
}
