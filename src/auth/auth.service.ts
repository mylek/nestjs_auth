import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Info } from '../user/entity/info.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Info) private readonly infoRepository: Repository<Info>,
    ) {
    }

    async create(data: any): Promise<User> {
        const user = this.userRepository.findOneBy({username: data.username});
        if (user instanceof User) {
            throw new BadRequestException('Cannot add user, username exist');
        }
        return await this.userRepository.save(data);
    }

    async findOne(condiction: any): Promise<User> {
        const user = await this.userRepository.findOneBy(condiction);
        if (!user) {
            throw new NotFoundException('User not exist');
        }
        return user;
    }

    async remove(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({id});
        if (!user) {
            throw new NotFoundException('User not exist');
        }
        return await this.userRepository.remove(user);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }
}