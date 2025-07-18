import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordService } from './forgotpassword.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../common/mail.service';
import { ConfigService } from '@nestjs/config';
import { Role } from './enums/role.enum';
import { encrypt, decrypt } from '../common/crypto.helper';
import { NotFoundException } from '@nestjs/common';

describe('ForgotPasswordService', () => {
    let service: ForgotPasswordService;
    let userRepository: Repository<User>;
    let userRepositoryToken: string | Function = getRepositoryToken(User);
    let fakeMailService: Partial<MailService>;
    let fakeConfigService: Partial<ConfigService>;
    let userData: User;

    const adminPanelUrl = 'http://localhost:3000/';
    const secretKey = 'secret';
    const token = 'bHJ2WQXDF0ixMzXIstK+Jw==:mEU/GkCr84NA3ursrhMBr8P1/Qg0Nt2Gnt64qC8J7aw=';

    fakeMailService = {
        sendMail: jest.fn().mockResolvedValue(true),
    };
    fakeConfigService = {
        get: (key: string) => {
            if (key === 'SECRET_KEY') {
                return secretKey;
            }
            if (key === 'URL_ADMIN_PANEL') {
                return adminPanelUrl;
            }
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ForgotPasswordService,
                {
                    provide: userRepositoryToken,
                    useClass: Repository,
                },
                {
                    provide: MailService,
                    useValue: fakeMailService,
                },
                {
                    provide: ConfigService,
                    useValue: fakeConfigService,
                }
            ]
        }).compile();

        service = module.get<ForgotPasswordService>(ForgotPasswordService);
        userRepository = module.get<Repository<User>>(userRepositoryToken);

        const id = 1;
        const email = 'testuser@o2.pl';
        const username = 'testuser';
        const password = 'testpassword';
        userData = { id: id, username: username, password: password, email: email, role: Role.USER } as User;
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userData);

    });


    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('getUserToken', () => {
        const token = service.getUserToken(userData);
        console.log(token);
        const [email, id] = decrypt(token, secretKey).split('_');

        expect(email).toBe(userData.email);
        expect(parseInt(id)).toBe(userData.id);}
    );

    it('getResetPasswordLink', () => {
        const resetUrl = service.getResetPasswordLink(userData);
        const [email, id] = decrypt(resetUrl.split('token=')[1], secretKey).split('_');

        expect(email).toBe(userData.email);
        expect(parseInt(id)).toBe(userData.id);}
    );

    it('verifyResetPasswordToken', () => {
        const email = service.verifyResetPasswordToken(token);
        expect(email).toBe(userData.email);
    });

    it('sendMail', async () => {
        expect(await service.sendMail(userData.email)).toBe(true);
    });

    it('sendMail user not exist', async () => {
        jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

        try {
            await service.sendMail(userData.email);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            expect(error.message).toBe('User not found');
        }
    });
});