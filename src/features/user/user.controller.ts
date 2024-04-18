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
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    return this.userService.findAll(page, pageSize);
  }

  @UseGuards(ApiKeyGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
