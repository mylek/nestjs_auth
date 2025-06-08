import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import {Response, Request} from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common/exceptions';
import { NotFoundException } from '@nestjs/common';
import { Role } from './enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAppService: Partial<AuthService>;
  let fakeJwtService: Partial<JwtService>;
  let responseMock: Response;
  let requestMock: Request;
  let userData;

  beforeEach(async () => {
    userData = { id: 1, username: 'testuser', email: 'testuser@example.com', password: 'hashedpassword', role: Role.USER };
    fakeAppService = {
      findOne: () => {
        return Promise.resolve(userData);
      },
      create: () => {
        return Promise.resolve(userData);
      },
      remove: () => {
        return Promise.resolve(userData);
      }
    };

    fakeJwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ id: 1 }),
    };
    requestMock = {
      cookies: { jwt: 'valid.jwt.token' },
    } as unknown as Request;
    responseMock = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Response;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
          {
              provide: AuthService,
              useValue: fakeAppService,
          },
          {
              provide: JwtService,
              useValue: fakeJwtService
          }
    ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it ('login user not exist', async () => {
    fakeAppService.findOne = jest.fn().mockImplementation(() => {
      throw new NotFoundException('User not exist');
    });

    try {
      await controller.login('testuser@example.com', 'wrongpassword', responseMock);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it ('register user', async () => {
    const result = await controller.register(userData.username, userData.email, userData.password);
    expect(result).toEqual(userData);
  });

  it ('register user with existing email', async () => {
    try {
      await controller.register(userData.username, userData.email, userData.password);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Email already exists');
    }
  });

  it ('user with valid token', async () => {
    const result = await controller.user(requestMock);
    expect(result).toEqual(userData);
  });

  it ('user invalid token', async () => {
    fakeJwtService.verifyAsync = jest.fn().mockResolvedValue(null);
    try {
      const result = await controller.user(requestMock);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Invalid token');
    }
  });

  it ('remove user', async () => {
    const result = await controller.remove(userData.id);
    expect(result).toEqual(userData);
  });

  it ('remove user not exist', async () => {
    fakeAppService.remove = jest.fn().mockImplementation(() => {
      throw new NotFoundException('User not exist');
    });

    try {
      await controller.remove(userData.id);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('User not exist');
    }
  });
});
