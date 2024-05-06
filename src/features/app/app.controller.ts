import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAppDto } from './dto/create-app.dto';

@ApiTags('App')
@Controller({ path: 'app', version: '1' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async create(@Body() createAppDto: CreateAppDto) {
    const status = await this.appService.findByKey('appVersion');

    if (status) {
      console.log('The record found, You should update it');
      return this.appService.update(createAppDto);
    } else {
      return this.appService.create(createAppDto);
    }
  }

  @Get()
  findAll() {
    return this.appService.findAppSetting();
  }

  @Get('/subscriptions')
  async subscriptions(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const data = await this.appService.subscriptions(page, pageSize);

    const count = await this.appService.subscriptionsCount();

    return { data, count };
  }
}
