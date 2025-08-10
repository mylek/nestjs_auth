import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Req,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { Role } from './enums/role.enum';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles/roles.guard';
import { AuthGuard } from './guards/auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly appService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    return this.appService.create({
      username,
      email,
      password: hashedPassword,
    });
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.appService.findOne({ email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });
    response.cookie('jwt', jwt, { httpOnly: true });

    return { token: jwt, role: user.role, id: user.id };
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
      if (!data) {
        throw new UnauthorizedException('Invalid token');
      }

      return await this.appService.findOne({ id: data.id });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'Logout successful' };
  }

  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.appService.remove(id);
  }

  @UseGuards(AuthGuard)
  //@UseGuards(RolesGuard)
  @Get('users')
  @Roles(Role.ADMIN)
  async getUsers() {
    return await this.appService.findAll();
  }
}
