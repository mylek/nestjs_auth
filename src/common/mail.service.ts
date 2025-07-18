import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

      constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: this.configService.get('MAIL_PORT'),
        });
    }

    async sendMail(to: string, subject: string, text: string): Promise<void> {
        await this.transporter.sendMail({
            from: this.configService.get('MAIL_FROM'),
            to,
            subject,
            text,
        });
    }
}