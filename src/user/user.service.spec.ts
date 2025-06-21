import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../auth/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm'
import { Role } from '../auth/enums/role.enum';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Info } from './entity/info.entity';

describe('UserService', () => {
    let service: UserService;
    let userRepository: Repository<User>;
    let infoRepository: Repository<Info>;
    let userRepositoryToken: string | Function = getRepositoryToken(User);
    let infoRepositoryToken: string | Function = getRepositoryToken(Info);
    let user1: User = { id: 1, username: 'test', password: 'pass', email: 'test@o2.pl', role: Role.USER } as User;
    let user2: User = { id: 2, username: 'test2', password: 'pass2', email: 'test2@o2.pl', role: Role.USER } as User;;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: userRepositoryToken,
                    useClass: Repository,
                },
                {
                    provide: infoRepositoryToken,
                    useClass: Repository,
                },
            ]
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(userRepositoryToken);
        infoRepository = module.get<Repository<Info>>(infoRepositoryToken);

        jest.spyOn(userRepository, 'find').mockResolvedValueOnce([user1]);
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(user1);
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user1);
        jest.spyOn(userRepository, 'delete').mockResolvedValue({} as DeleteResult);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('get list 2 user', async () => {
        const limit: number = 2;
        jest.spyOn(userRepository, 'findAndCount').mockReset().mockResolvedValueOnce([[user1, user2], limit]);
        const res = await service.list(limit, 0);

        expect(res['list'].length).toBe(limit);
        expect(res['total']).toBe(limit);
    });

    it('get sort condition by username DESC', async () => {
        const condiction = await service.getCondiction(10, 1, 'DESC', 'username');

        expect(condiction['order'].username).toBe('DESC');
    });

    it('get page 4 with limit 10', async () => {
        const condiction = await service.getCondiction(10, 4);

        expect(condiction['take']).toBe(10);
        expect(condiction['skip']).toBe(4);
    });

    it('getByUsername', async () => {
        const user = await service.getByUsername(user1.username);

        expect(user?.username).toBe(user1.username);
    });

    it('getById', async () => {
        const user = await service.getById(user1.id);

        expect(user?.id).toBe(user1.id);
    });

    it ('detete user exist', async () => {
        try {
            const user = await service.delete(user1.id);
        } catch (e) {
            fail('Expected NotFoundException');
        }
    });

    it('getById uset not exist', async () => {
        jest.spyOn(userRepository, 'findOne').mockReset().mockImplementation(() => {
            throw new NotFoundException('User not exist');
        });

        try {
            const user = await service.getById(user1.id);
            fail('Expected NotFoundException');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
        }
    });

    it ('detete user not exist', async () => {
        jest.spyOn(userRepository, 'findOne').mockReset().mockImplementation(() => {
            throw new NotFoundException('User not exist');
        });

        try {
            const user = await service.delete(123);
            fail('Expected NotFoundException');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
        }
    });

    it('deleteMany', async () => {
        const ids = [user1.id, user2.id];
        const result = await service.deleteMany(ids);

        expect(result[0].length).toBe(2);
    });

    it('update', async () => {
        jest.spyOn(userRepository, 'save').mockResolvedValue(user1);
        jest.spyOn(infoRepository, 'save').mockResolvedValue({} as Info);

        const newName = 'newName';
        const id = user1.id;
        const data = { username: newName };
        const result = await service.update(id, data);

        expect(result.username).toBe(newName);
    });
});