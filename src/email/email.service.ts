import {Injectable} from '@nestjs/common';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

@Injectable()
export class EmailService {
    private transporter: Mail;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'leecoder5359@gmail.com',
                pass: 'wuxhhamlezzffpsj',//'rhaehfdl1~'
            }
        });
    }

    async sendMailJoinVerification(emailAddress: string, signUpVerifyToken: any) {
        const baseUrl = 'http://localhost:3000';

        const url = `${baseUrl}/users/email-verify?signUpVerifyToken=${signUpVerifyToken}`

        const mailOptions: EmailOptions = {
            to: emailAddress,
            subject: '가입 인증 메일',
            html: '' +
                '가입확인 버튼을 누르시면 가입 인증이 완료됩니다. <br/>' +
                '<form action="${url}" method="POST">' +
                '   <button>가입확인</button>' +
                '</form>',
        }

        return await this.transporter.sendMail(mailOptions);
    }
}
