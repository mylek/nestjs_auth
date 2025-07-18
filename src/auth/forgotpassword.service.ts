import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MailService } from '../common/mail.service';
import { ConfigService } from '@nestjs/config';
import { encrypt, decrypt } from '../common/crypto.helper';



export class ForgotPasswordService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly mailService: MailService,
        private readonly configService: ConfigService
    ) {
    }

    async sendMail(email: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const resetLink = this.getResetPasswordLink(user);
        await this.mailService.sendMail(email, 'Reset password', 'Link do resetu hasła... ' + resetLink);
    }

    getResetPasswordLink(user: User): string {
        const token = user.email + '_' + user.id;
        const encryptedToken = encrypt(token, <string>this.configService.get('SECRET_KEY'));
        return this.configService.get('URL_ADMIN_PANEL') + `reset-password?token=${encryptedToken}`;
    }

    verifyResetPasswordToken(token: string): string {
        try {
            const decrypted = decrypt(token, <string>this.configService.get('SECRET_KEY'));
            const email = decrypted.split('_')[0];
            return email;
        } catch (error) {
            throw new BadRequestException('Invalid or expired token');
        }
    }
}