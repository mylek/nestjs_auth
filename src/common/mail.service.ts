import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as process from 'node:process';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST ?? '',
      port: process.env.MAIL_PORT ?? 587,
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    await this.transporter
      .sendMail({
        from: process.env.MAIL_FROM ?? '',
        to,
        subject,
        text,
      })
      .then(() => {
        return true;
      })
      .catch((e) => {
        return false;
      });
  }
}
