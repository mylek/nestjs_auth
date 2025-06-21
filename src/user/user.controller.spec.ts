import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../auth/user.entity';
import { Role } from '../auth/enums/role.enum';

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  let usersData: Object;
  let user1: User;
  let user2: User;
  let users: User[];

  beforeEach(async () => {
    user1 = {id: 1, username: 'test', password: 'test', email: 'test@email.pl', role: Role.USER} as User;
    user2 = {id: 2, username: 'test2', password: 'test2', email: 'tes2t@email.pl', role: Role.ADMIN} as User;
    users = [user1, user2];
    usersData = {
      list: users,
      total: users.length
    };
    fakeUserService = {
      list: () => {
        return Promise.resolve(usersData);
      },
      getByUsername: () => {
        return Promise.resolve(user1);
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it ('get user isset', async () => {
    const username = 'test';
    const user = await controller.getByUsername(username);
    expect(user.username).toBe(username);
  });

  it ('get list user', async () => {
    fakeUserService.list = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        list: [user1],
        total: 1
      });
    });
    const res = await controller.getList(1, 0);
    expect(res['list'].length).toBe(1);
    expect(res['total']).toBe(1);
  });
});
