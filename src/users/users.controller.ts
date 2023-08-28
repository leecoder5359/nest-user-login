import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {UsersService} from "./users.service";

class UserInfo {
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }
    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        const { name, email, password } = dto;
        await this.usersService.createUser(name, email, password);
        console.log(dto);
    }

    @Post('/email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        const { signUpVerifyToken } = dto;
        return await this.usersService.verifyEmail(signUpVerifyToken);
    }

    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<string> {
        console.log(dto);
        return;
    }

    @Get('/:id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
        console.log(userId);
        return;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
