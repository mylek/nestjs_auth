import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
  Body,
  Delete,
  UseGuards,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../auth/user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('')
  async getList(
    @Query('limit') limit?: number,
    @Query('page') offset?: number,
    @Query('sort') sort?: string,
    @Query('field') field?: string,
  ): Promise<Object> {
    return await this.userService.list(limit, offset, sort, field);
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<User> {
    return await this.userService.getById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<User> {
    return await this.userService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.userService.delete(id);
    return ['User id ' + id + ' delete'];
  }

  @Post('change-my-password')
  async changeMyPassword(
    @Body('password') password: string,
    @Req() request: Request,
  ) {
    try {
      if (!request.user) {
        throw new UnauthorizedException('Invalid token');
      }
      const { id } = request.user as User;
      this.userService.changePassword(id, password);
      return { error: false, message: 'Password changed successfully' };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  @Delete('')
  async deleteMany(@Body() ids: any): Promise<object> {
    return await this.userService.deleteMany(ids);
  }

  @Get('usernameexist/:username/:userid')
  async checkUsername(
    @Param('username') username: string,
    @Param('userid') userId: number,
  ) {
    try {
      const currentUser = await this.userService.getById(userId);
      if (currentUser.username == username) {
        return { error: false };
      }

      const user = await this.userService.getByUsername(username);
      if (!user) {
        return { error: false };
      }
    } catch (e) {
      return { error: true };
    }

    return { error: true };
  }

  async getByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.userService.getByUsername(username);
    if (!user) {
      throw new NotFoundException('User ' + username + 'not exist');
    }

    return user;
  }
}
