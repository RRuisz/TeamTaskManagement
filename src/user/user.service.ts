import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {UserDto} from "./dto";
import * as argon from 'argon2';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";


@Injectable()
export class UserService {
    constructor( private prisma: PrismaService) {

    }

    async createNewUser(dto: UserDto) {
        try {
            return await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password_hash: dto.password,
                    firstName: dto.firstName,
                    lastName: dto.lastName
                }
            });
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    throw new ForbiddenException('Email already taken!');
                }
            }
            throw e;
        }
    }

    async verifyUser(data: {email: string, password: string}){
        const user = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (!user) throw new NotFoundException('User not found')

        const verify = await argon.verify(user.password_hash, data.password)

        if (verify) {
            return user;
        } else {
            throw new NotFoundException('User not found')
        }
    }

}