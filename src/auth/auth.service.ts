import {ForbiddenException, Injectable} from '@nestjs/common';
import * as argon from 'argon2';
import {UserService} from "../user/user.service";
import { UserCreateDto } from '../user/dto';
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";



@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwt: JwtService, private readonly config: ConfigService) {

    }

    async registerUser(dto: UserCreateDto) {
        const password = await argon.hash(dto.password)
        const user = await this.userService.createNewUser({...dto, password})

        return await this.signToken(user.id, user.email)
    }

    async loginUser(data: {email: string, password: string}) {
        const user = await this.userService.verifyUser(data)
        if (!user) throw new ForbiddenException('User not found!')

        return this.signToken(user.id, user.email)
    }

    protected async signToken(userId: number, userEmail: string) {
        const payload = {
            sub: userId,
            email: userEmail
        }

        return {
            accessToken: await this.jwt.signAsync(payload, {
                expiresIn: "600min",
                secret: this.config.get("JWT_SECRET")
            })
        }
    }
}
