import { ProfilController } from './profil.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ImageService } from '../common/image.service';
import { ProfilService } from './profil.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Token } from '../auth/enums/token.enum';
import { User } from '../auth/user.entity';
import { Role } from '../auth/enums/role.enum';
import { UpdateProfilDto } from './dto/update-profil.dto';

describe('ProfilController', () => {
  let controller: ProfilController;
  let fakeProfilService: Partial<ProfilService>;
  let fakeImageService: Partial<ImageService>;
  let user1: User;

  beforeEach(async () => {
    user1 = {
      id: 1,
      username: 'test',
      password: 'test',
      email: 'test@email.pl',
      role: Role.USER,
      info: {
        firstname: 'Test',
        lastname: 'Test',
        street: 'Test',
        city: 'Test',
        postcode: '123-12',
      },
    } as User;
    fakeProfilService = {
      getById: () => {
        return Promise.resolve(user1);
      },
      update: () => {
        return Promise.resolve(user1);
      },
    };
    fakeImageService = {
      uploadImage: () => {
        return Promise.resolve('image.png');
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilController],
      imports: [
        JwtModule.register({
          secret: Token.TOKEN_SECRET, // lub dowolny string do testów
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        {
          provide: ImageService,
          useValue: fakeImageService,
        },
        {
          provide: ProfilService,
          useValue: fakeProfilService,
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfilController>(ProfilController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getUserInfo', async () => {
    const userData: User = await controller.getUserInfo(user1.id);
    expect(userData).toEqual(user1);
  });
  it('save', async () => {
    const createProfilDto: UpdateProfilDto = {
      info: {
        firstname: user1.info.firstname,
        lastname: user1.info.lastname,
        city: user1.info.city,
      },
      image: {
        base64: '1234',
      },
    };
    const response = await controller.save(user1.id, createProfilDto);
    expect(response.message).toEqual('Saved');
  });

  it('empty foto', async () => {
    const createProfilDto: UpdateProfilDto = {
      info: {
        firstname: user1.info.firstname,
        lastname: user1.info.lastname,
        city: user1.info.city,
      },
      image: {
        base64: undefined,
      },
    };
    const response = await controller.save(user1.id, createProfilDto);
    expect(response.message).toEqual('Image is required');
  });
});
