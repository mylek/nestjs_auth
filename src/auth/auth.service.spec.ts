import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Role } from './enums/role.enum';

describe('AuthService', () => {
    let service: AuthService;
    let userRepository: Repository<User>;
    let userRepositoryToken: string | Function = getRepositoryToken(User);
    let userData;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: userRepositoryToken,
                    useClass: Repository,
                },
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<User>>(userRepositoryToken);

        const id = 1;
        const email = 'testuser@o2.pl';
        const username = 'testuser';
        const password = 'testpassword';
        userData = { id: id, username: username, password: password, email: email, role:  Role.USER} as User;
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userData);
        jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userData);
        jest.spyOn(userRepository, 'remove').mockResolvedValueOnce(userData);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it ('create user', async () => {
        expect(await service.create(userData)).toEqual(userData);
    });

    it ('create user exist', async () => {
        try {
            const user = await service.create(userData);
        } catch(error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    });

    it ('findOne', async () => {
        const user = await service.findOne({username: userData.username});
        expect(user.username).toBe(userData.username);
    });

    it ('delete user', async () => {
        expect(await service.remove(userData.id)).toEqual(userData);
    });

    it ('delete user not exist', async () => {
        jest.spyOn(userRepository, 'findOneBy').mockClear().mockResolvedValueOnce(null);
        try {
            await service.remove(userData.id);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
        }
    });
});