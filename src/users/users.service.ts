import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import * as uuid from 'uuid';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  remove(id: string) {
    return `this action removes #${id} users`;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const userExist = await this.checkUserExists(email);

    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signUpVerifyToken = uuid.v1();

    // await this.usersRepository.save(createUserDto, signUpVerifyToken);
    // await this.saveUserUsingQueryRunner(createUserDto, signUpVerifyToken);
    await this.saveUserUsingTransaction(createUserDto, signUpVerifyToken);
    await this.sendMemberJoinEmail(email, signUpVerifyToken);
  }

  private async saveUserUsingTransaction(
    createUserDto: CreateUserDto,
    signUpVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const { name, email, password } = createUserDto;
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signUpVerifyToken = signUpVerifyToken;

      await manager.save(user);
    });
  }

  private async saveUserUsingQueryRunner(
    createUserDto: CreateUserDto,
    signUpVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { name, email, password } = createUserDto;
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signUpVerifyToken = signUpVerifyToken;

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async checkUserExists(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    return user;
  }

  async saveUser(createUserDto: CreateUserDto, signUpVerifyToken: string) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.signUpVerifyToken = signUpVerifyToken;

    await this.usersRepository.save(user);
  }

  private async sendMemberJoinEmail(email: string, signUpVerifyToken: any) {
    await this.emailService.sendMailJoinVerification(email, signUpVerifyToken);
  }

  async verifyEmail(signUpVerifyToken: string) {
    // TODO:
    // 1. DB에서 token으로 회원 가입 처리중인 유저가 있는지 조회 후 없다면 에러

    // 2. 바로 로그인 상태가 되도록 jwt를 발급

    throw new Error('Method not implemented');
    return '';
  }
}
