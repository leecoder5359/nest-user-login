import { Inject, Injectable } from '@nestjs/common';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as process from 'process';
import emailConfig from '../config/emailConfig';
import { ConfigType } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASSWORD,
      },
    });
  }

  async sendMailJoinVerification(emailAddress: string, signUpVerifyToken: any) {
    const baseUrl = process.env.EMAIL_BASE_URL;

    const url = `${baseUrl}/users/email-verify?signUpVerifyToken=${signUpVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html:
        '' +
        '가입확인 버튼을 누르시면 가입 인증이 완료됩니다. <br/>' +
        `<form action="${url}" method="POST">` +
        '   <button>가입확인</button>' +
        '</form>',
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
