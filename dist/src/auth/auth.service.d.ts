import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class AuthService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(data: any): Promise<User>;
    findOne(condiction: any): Promise<User | null>;
}
