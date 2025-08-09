import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

describe('MailhService', () => {
  let mailService: MailService;
  let fakeConfigService: Partial<ConfigService>;

  fakeConfigService = {
    get: jest.fn().mockImplementation((key: string): string => {
      const config = {
        MAIL_HOST: 'smtp.example.com',
        MAIL_PORT: 587,
        MAIL_FROM: 'noreply@example.com',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: fakeConfigService,
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  it('should call sendMail with correct parameters', async () => {
    const sendMailMock = jest
      .spyOn(mailService, 'sendMail')
      .mockResolvedValueOnce();

    await mailService.sendMail('test@example.com', 'Test Subject', 'Test Body');

    expect(sendMailMock).toHaveBeenCalledWith(
      'test@example.com',
      'Test Subject',
      'Test Body',
    );
  });
});
