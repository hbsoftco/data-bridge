import { Controller, Param, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    return this.userService.findAll(page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
