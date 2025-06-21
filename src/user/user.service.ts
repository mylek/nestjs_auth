import { NotFoundException } from "@nestjs/common";
import { User } from "../auth/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Info } from "./entity/info.entity";

export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Info) private readonly infoRepository: Repository<Info>,
    ) {
    }

    async list(
        limit?: number,
        offset?: number,
        sort?: string,
        field?: string
    ): Promise<Object> {
        const [list, total] = await this.userRepository.findAndCount({
            ...this.getCondiction(limit, offset, sort, field),
            relations: ['info']
        });
        return {
            list: list,
            total: total
        };
    }

    getCondiction(
        limit?: number,
        offset?: number,
        sort?: string,
        field?: string
    ): Object {
        const condiction = {};
        if (limit) {
            condiction['take'] = limit;
        }

        if (offset) {
            condiction['skip'] = offset;
        }

        if (sort && field) {
            condiction['order'] = { [field]: sort };
        }

        return condiction;
    }

    async getByUsername(username: string): Promise<User | null> {
        console.log(2222);
        return await this.userRepository.findOneBy({ username });
    }

    async getById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id: id
            },
            relations: ['info']
        });
        if (!user) {
            throw new NotFoundException('User id: ' + id + ' no exist');
        }
        return user;
    }

    async delete(id: number) {
        const user = await this.getById(id);
        await this.userRepository.delete(user);
    }

    async deleteMany(ids: number[]): Promise<object> {
        await this.userRepository.delete(ids);
        return [ids];
    }

    async update(id: number, params: any): Promise<User> {
        const user = await this.getById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        Object.assign(user, params);
        
        const userModel = await this.userRepository.save(user);
        if (user.info) {
            await this.infoRepository.save(Object.assign({userId: id}, user.info));
        }
        return userModel;
    }
}