import { Controller, Get, NotFoundException, Param, Put, Query, Body, Delete, UseGuards, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from "../auth/user.entity";
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }


    //@UseGuards(RolesGuard)
    //@Roles(Role.USER)
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
    async update(
        @Param('id') id: number,
        @Body() data: any
    ): Promise<User> {
        return await this.userService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.userService.delete(id);
        return ['User id ' + id + ' delete'];
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
                return {error: false};
            }

            const user = await this.userService.getByUsername(username);
            if (!user) {
                return {error: false};
            }
        } catch (e) {
            return {error: true};
        }
        
        return {error: true};
    }

    async getByUsername(
        @Param('username') username: string
    ): Promise<User> {
        const user = await this.userService.getByUsername(username);
        if (!user) {
            throw new NotFoundException('User ' + username + 'not exist');
        }

        return user;
    }
}
