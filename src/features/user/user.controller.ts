import {
  Controller,
  Param,
  Get,
  Query,
  UseGuards,
  Post,
  Body,
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
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const data = await this.userService.findAll(
      page,
      pageSize,
      filter,
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
  @Get('/data/:userId')
  async getUserDataList(
    @Param('userId') userId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('sessionType') sessionType: string,
    @Query('type') type: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const data = await this.userService.getUserDataList(
      +userId,
      page,
      pageSize,
      sessionType,
      type,
      fromDate,
      toDate,
    );

    const count = await this.userService.userDataCount(
      +userId,
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
}
