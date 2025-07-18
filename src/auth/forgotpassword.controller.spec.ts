import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordService } from './forgotpassword.service';
import { User } from './user.entity';
import { ForgotPasswordController } from './forgotpassword.controller';
import { Role } from './enums/role.enum';
import { BadRequestException } from '@nestjs/common';

describe('ForgotPasswordController', () => {
    let controller: ForgotPasswordController;
    let fakeForgotPasswordService: Partial<ForgotPasswordService>;
    let userData: User;
    const token = 'bHJ2WQXDF0ixMzXIstK+Jw==:mEU/GkCr84NA3ursrhMBr8P1/Qg0Nt2Gnt64qC8J7aw=';
    const id = 1;
    const email = 'testuser@o2.pl';
    const username = 'testuser';
    const password = 'testpassword';
    userData = { id: id, username: username, password: password, email: email, role: Role.USER } as User;


    beforeEach(async () => {
        fakeForgotPasswordService = {
            sendMail: jest.fn().mockResolvedValue(true),
            verifyResetPasswordToken: jest.fn().mockReturnValue(userData.email),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ForgotPasswordController],
            providers: [
                {
                    provide: ForgotPasswordService,
                    useValue: fakeForgotPasswordService,
                }
            ],
        }).compile();

        controller = module.get<ForgotPasswordController>(ForgotPasswordController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('forgotPassword', async () => {
        const res = await controller.forgotPassword(userData.email);
        expect(res).toEqual({ error: false, message: 'Email sent successfully' });
    });

    it('checkToken bad mail', async () => {
        const res = await controller.checkToken(token, 'wrongemail@o2.pl');
        expect(res).toEqual({ error: true, message: 'Email does not match the token' });
    });

    it('checkToken bad mail 2', async () => {
        jest.spyOn(fakeForgotPasswordService, 'verifyResetPasswordToken').mockReset().mockReturnValue('wrongemail@o2.pl');
        const res = await controller.checkToken(token, userData.email);
        expect(res).toEqual({ error: true, message: 'Email does not match the token' });
    });

    it('checkToken bad mail 3', async () => {
        jest.spyOn(fakeForgotPasswordService, 'verifyResetPasswordToken').mockReset().mockImplementation(() => {
            throw new BadRequestException('Invalid or expired token');
        });
        const res = await controller.checkToken(token, userData.email);
        expect(res).toEqual({ error: true, message: 'Invalid or expired token' });
    });
});