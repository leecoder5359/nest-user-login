import {Injectable} from "@nestjs/common";
import * as uuid from 'uuid';
import {EmailService} from "../email/email.service";

@Injectable()
export class UsersService {
    constructor(private readonly emailService: EmailService) {}

    remove(id: string) {
        return `this action removes #${id} users`;
    }

    async createUser(name: string, email: string, password: string) {
        await this.checkUserExists(email);

        const signUpVerifyToken = uuid.v1();

        await this.saveUser(name, email, signUpVerifyToken);
        await this.sendMemberJoinEmail(email, signUpVerifyToken);
    }

    private async checkUserExists(email: string) {
        return false;
    }

    private async saveUser(name: string, email: string, signUpVerifyToken: any) {
        return;
    }

    private async sendMemberJoinEmail(email: string, signUpVerifyToken: any) {
        await this.emailService.sendMailJoinVerification(email, signUpVerifyToken);
    }

    async verifyEmail(signUpVerifyToken: string) {
        // TODO:
        // 1. DB에서 token으로 회원 가입 처리중인 유저가 있는지 조회 후 없다면 에러

        // 2. 바로 로그인 상태가 되도록 jwt를 발급

        throw new Error('Method not implemented');
        return "";
    }
}