import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {UserCreateDto, UserResponseDto, userUpdateDto} from "./dto";
import * as argon from 'argon2';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {User} from "@prisma/client";


@Injectable()
export class UserService {
    constructor( private prisma: PrismaService) {

    }

    async createNewUser(dto: UserCreateDto) {
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

    async getUserProfile(user: User) {
        const { id, email, firstName, lastName, createdAt } = user;
        return { id, email, firstName, lastName, createdAt };
    }

    async updateUser(userDto: userUpdateDto, id: number): Promise<UserResponseDto> {
        const data: Partial<Pick<User, 'email' | 'firstName' | 'lastName' | 'password_hash'>> = {};

        if (userDto.email) data.email = userDto.email;
        if (userDto.firstName) data.firstName = userDto.firstName
        if (userDto.lastName) data.lastName = userDto.lastName
        if (userDto.password) data.password_hash = await argon.hash(userDto.password)

        const user = await this.prisma.user.update({
            where: {
                id: id
            },
            data: data
        });

        const { password_hash, ...userResponse } = user;
        return userResponse;
    }

}