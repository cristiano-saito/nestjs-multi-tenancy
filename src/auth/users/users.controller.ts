import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPresenter } from './users.presenter';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    const user = await this.usersService.createCommonUser(data);

    return new UserPresenter(user);
  }

  @Get()
  list() {
    return this.usersService.listUsers();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.removeUser(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.listOneUser(id);
  }
}
