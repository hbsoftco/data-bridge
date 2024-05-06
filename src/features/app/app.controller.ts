import { Controller, Get, Post, Body } from '@nestjs/common';
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
}
