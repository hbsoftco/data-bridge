import { Controller, Param, Get, Query, UseGuards } from '@nestjs/common';
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
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const data = await this.userService.findAll(
      page,
      pageSize,
      filter,
      sex,
      fromDate,
      toDate,
    );
    const count = await this.userService.count(filter, sex, fromDate, toDate);

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
  ) {
    const data = await this.userService.getUserDataList(
      +userId,
      page,
      pageSize,
      sessionType,
    );

    return { data };
  }
}
